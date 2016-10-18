import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus, Tag } from './shared/interfaces';
import { queries, AttributeCounter } from './shared';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-graphql',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.initPolling();
    this.initCountReducer();
  }

  sidebarFilterClass() {
    let self = this;
    return (filter: string, attribute: string) => {
      if (filter === 'tags' && self.tags && self.tags[attribute]) {
        return `filter-tags filter-tags-${self.tags[attribute].colornumber}`;
      }
    };
  }

  private getAllTags(): void {
    this.apollo
      .watchQuery({
        query: queries.getAllTags
      })
      .subscribe((response: any) => {
        let tags = response.data.tags;
        tags
          .forEach((tag: Tag) => {
            this.tags[tag.name] = tag;
          });
      })
  }

  private initPolling(): void {
    this.queryPolling = this.apollo.watchQuery({
        query: queries.getAllNodes,
        pollInterval: 10000
      })

    this.queryPolling
      .subscribe((_: ApolloQueryResult) => {
        this.clusterNodeSubscription.next(_.data.nodes);
      });

    this.clusterNodeFilteredSubscription =
      this.clusterNodeSubscription
        .combineLatest<any, ClusterNode[]>(this.attributeFilter, this.filterNodesWithAttributes);
  }

  private filterNodesWithAttributes(nodes: ClusterNode[], filter: any): ClusterNode[] {
    if (Object.keys(filter).length === 0) {
      return nodes;
    }
    return nodes
      .filter(simpleAttributeFilter('cores'))
      .filter(simpleAttributeFilter('memory'))
      .filter(simpleAttributeFilter('location'))
      .filter(arrayAttributeFilter('tags', (_: Tag) => _.name));

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
      return Object.keys(_).map(function(key) {
        return _[key];
      });
    }
  }

  private initCountReducer(): void {
    const simple = ['cores', 'memory', 'location'];
    const array = ['tags'];

    const attributeCounter = new AttributeCounter<ClusterNode>(simple, array)
      .counterFrom(this.clusterNodeSubscription);
    const attributeCounterFiltered = new AttributeCounter<ClusterNode>(simple, array)
      .counterFrom(this.clusterNodeFilteredSubscription);

    this.attributeCounter =
      attributeCounter
        .combineLatest(attributeCounterFiltered, combineCounters);

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
  }
}
