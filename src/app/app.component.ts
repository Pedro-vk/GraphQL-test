import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus, Tag } from './shared/interfaces';
import { queries, AttributeCounter } from './shared';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-graphql',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./app.html'),
  styles: [require('./app.scss')]
})
export class AppComponent implements OnInit {
  attributeFilter: Subject<any> = new Subject<any>();
  private tags: { [tag: string]: Tag; } = {};
  private queryPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();
  private clusterNodeFilteredSubscription: Observable<ClusterNode[]>;
  private attributeCounter: Observable<any>;

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit(): void {
    this.getAllTags();
    this.initNodesPolling();
    this.initStatusPolling();
    this.initCountReducer();
  }

  sidebarFilterClass() {
    let self = this;
    return (filter: string, attribute: string) => {
      if (filter === 'tags' && self.tags && self.tags[attribute]) {
        return `filter-tags filter-tags-${self.tags[attribute].colornumber}`;
      }
      if (filter === 'statuses') {
        return `filter-service filter-service-${attribute.toLowerCase()}`;
      }
    };
  }

  private getAllTags(): void {
    this.apollo
      .query({
        query: queries.getAllTags
      })
      .then((response: any) => {
        let tags = response.data.tags;
        tags
          .forEach((tag: Tag) => {
            this.tags[tag.name] = tag;
          });
      })
  }

  private initNodesPolling(): void {
    this.queryPolling = this.apollo.watchQuery({
        query: queries.getAllNodes,
        pollInterval: 30 * 1000
      })

    this.queryPolling
      .subscribe((_: ApolloQueryResult) => {
        this.clusterNodeSubscription.next(_.data.nodes);
      });

    this.clusterNodeFilteredSubscription =
      this.clusterNodeSubscription
        .combineLatest<any, ClusterNode[]>(this.attributeFilter, this.filterNodesWithAttributes);
  }

  private initStatusPolling(): void {
    this.apollo.watchQuery({
      query: queries.getAllStatus,
      pollInterval: 5 * 1000
    })
      .subscribe(_ => {});
  }

  private filterNodesWithAttributes(nodes: ClusterNode[], filter: any): ClusterNode[] {
    if (Object.keys(filter).length === 0) {
      return nodes;
    }
    return nodes
      .filter(simpleAttributeFilter('cores'))
      .filter(simpleAttributeFilter('memory'))
      .filter(simpleAttributeFilter('location'))
      .filter(arrayAttributeFilter('tags', (_: Tag) => _.name))
      .filter(arrayAttributeFilter('statuses', (_: Status) => _.service.name));

    function simpleAttributeFilter(attr: string) {
      return (item: any): boolean => {
        if (filter[attr] && getValues(filter[attr]).indexOf(true) === -1) {
          return true;
        }
        return filter[attr][item[attr]];
      }
    }
    function arrayAttributeFilter(attr: string, filterFn: (_: any) => string) {
      return (item: any): boolean => {
        if (filter[attr] && getValues(filter[attr]).indexOf(true) === -1) {
          return true;
        }
        let itemElements = item[attr].map(filterFn);
        let filterElements = Object.keys(filter[attr])
          .filter((_: any) => filter[attr][_]);

        return filterElements
          .map((_: string) => itemElements.indexOf(_) !== -1)
          .indexOf(true) !== -1;
      }
    }
    function getValues(_: any): any[] {
      return Object.keys(_).map((key) => _[key]);
    }
  }

  private initCountReducer(): void {
    const simple = ['cores', 'memory', 'location'];
    const arrays = {
      'tags': (_: Tag) => _.name,
      'statuses': (_: Status) => _.service.name,
    };

    const attributeCounter = new AttributeCounter<any>(simple, arrays)
      .counterFrom(this.clusterNodeSubscription);
    const attributeCounterFiltered = new AttributeCounter<any>(simple, arrays)
      .counterFrom(this.clusterNodeFilteredSubscription);

    this.attributeCounter =
      attributeCounter
        .combineLatest(attributeCounterFiltered, combineCounters)
        .map(counterToArrayAndSort);

    function combineCounters(counterComplete: any, counterFiltered: any) {
      let counterCompleteCopy = JSON.parse(JSON.stringify(counterComplete));
      Object.keys(counterCompleteCopy)
        .forEach((key: string) => {
          Object.keys(counterCompleteCopy[key])
            .forEach((attr: string) => {
              counterCompleteCopy[key][attr] = counterFiltered[key][attr] || 0;
            });
        });
      return counterCompleteCopy;
    }

    function counterToArrayAndSort(counter: any) {
      const filterOrder = ['statuses', 'location', 'tags'].reverse();
      return Object.keys(counter)
        .map((key: string) => ({key, value: counter[key]}))
        .sort((a: any, b: any) => {
          return filterOrder.indexOf(a.key) > filterOrder.indexOf(b.key) ? -1 : 1;
        });
    }
  }
}
