import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { onShowAnimation } from './dashboard.animations';

import { ClusterNode, Status, StatusStatus, Tag } from '../shared/interfaces';
import { queries, AttributeCounter } from '../shared';
import { ClusterService } from '../shared/services';
import { ToggleAllService } from './services';

@Component({
  selector: 'pgp-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./dashboard.html'),
  styles: [require('./dashboard.scss')],
  animations: [onShowAnimation],
})
export class DashboardComponent implements OnInit {
  projectAuthor: string = '';
  projectVersion: string = '';
  githubRepositoryUrl: string = '';
  viewBy: Subject<any> = new Subject<string>();
  orderByFilter: Subject<any> = new Subject<string>();
  attributeFilter: Subject<any> = new Subject<any>();
  searchFilter: Subject<any> = new Subject<string>();
  private tags: { [tag: string]: Tag; } = {};
  private clusterNodeSubscription: Observable<ClusterNode[]>;
  private clusterNodeFilteredSubscription: Observable<ClusterNode[]>;
  private attributeCounter: Observable<any>;
  constructor(private clusterService: ClusterService) { }

  ngOnInit(): void {
    this.clusterNodeSubscription = this.clusterService.getClusterNodeSubscription();

    this.getAllTags();
    this.initNodesFiltering();
    this.initCountReducer();
    this.getGithubRepositoryUrl();
  }

  sidebarFilterClass(): (filter: string, attribute: string) => string {
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

  getGithubRepositoryUrl(): void {
    try {
      const packageInfo = require('../../../package.json');

      this.githubRepositoryUrl = packageInfo.repository.url;
      this.projectVersion = packageInfo.version;
      this.projectAuthor = packageInfo.author.split(' <')[0];
    } catch (e) { }
  }

  updateStatus (status: Status): void {
    let newStatus: StatusStatus;
    switch (status.status) {
      default:
      case 'WAITING': return;
      case 'STARTED': newStatus = 'STOPPED'; break;
      case 'STOPPED': newStatus = 'STARTED'; break;
    }
    this.clusterService.updateStatus(status.id, newStatus);
  }

  updateAllStatus (bulkStatus: ToggleAllService): void {
    bulkStatus.service.statuses
      .filter((status: Status) => status.status !== bulkStatus.status)
      .forEach((status: Status) => {
        this.clusterService.updateStatus(status.id, bulkStatus.status);
      });
  }

  changeViewBy(value: string): void {
    this.viewBy.next(value);
    setTimeout(() => this.viewBy.next(value), 10);
  }

  private getAllTags(): void {
    this.clusterService
      .getAllTags()
      .then((tags: Tag[]) => {
        tags
          .forEach((tag: Tag) => {
            this.tags[tag.name] = tag;
          });
      });
  }

  private initNodesFiltering(): void {
    this.clusterNodeFilteredSubscription =
      this.clusterNodeSubscription
        .combineLatest(
          this.attributeFilter, this.orderByFilter, this.searchFilter, this.viewBy,
          this.filterNodesWithAttributes
        )
        .share();
  }

  private filterNodesWithAttributes(nodes: ClusterNode[], filter: any, orderBy: string, search: string): ClusterNode[] {
    if (Object.keys(filter).length === 0) {
      return nodes;
    }
    return nodes
      .filter(simpleAttributeFilter('cores'))
      .filter(simpleAttributeFilter('memory'))
      .filter(simpleAttributeFilter('location'))
      .filter(arrayAttributeFilter('tags', (_: Tag) => _.name))
      .filter(arrayAttributeFilter('statuses', (_: Status) => _.service.name))
      .filter(searchInAttributes(search, ['name', 'location', 'localIp']))
      .sort((a: ClusterNode, b: ClusterNode) => a[orderBy] > b[orderBy] ? 1 : -1);

    function searchInAttributes(filterSearch: string, attrs: string[]): (item: any) => boolean {
      return (item: any): boolean => {
        if (filterSearch === '') {
          return true;
        }
        filterSearch = filterSearch.trim().toLowerCase();
        for (let key of attrs) {
          if (item[key].toLowerCase().indexOf(filterSearch) !== -1) {
            return true;
          }
        }
        return false;
      };
    }
    function simpleAttributeFilter(attr: string): (item: any) => boolean {
      return (item: any): boolean => {
        if (filter[attr] && getValues(filter[attr]).indexOf(true) === -1) {
          return true;
        }
        return filter[attr][item[attr]];
      };
    }
    function arrayAttributeFilter(attr: string, filterFn: (_: any) => string): (item: any) => boolean {
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
      };
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

    function combineCounters(counterComplete: any, counterFiltered: any): any {
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

    function counterToArrayAndSort(counter: any): any[] {
      const filterOrder = ['statuses', 'location', 'tags'].reverse();
      return Object.keys(counter)
        .map((key: string) => ({key, value: counter[key]}))
        .sort((a: any, b: any) => {
          return filterOrder.indexOf(a.key) > filterOrder.indexOf(b.key) ? -1 : 1;
        });
    }
  }
}
