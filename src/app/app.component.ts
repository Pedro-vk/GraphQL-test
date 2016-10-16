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
  private queryPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();
  private attributeCounter: Observable<any>;

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit(): void {
    this.initPolling();
    this.initCountReducer();
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
  }

  private initCountReducer(): void {
    this.attributeCounter = new AttributeCounter<ClusterNode>(["cores", "memory"], ["tags"])
      .counterFrom(this.clusterNodeSubscription);

    this.attributeCounter
      .subscribe((_: any) => console.log(111121, _));
  }
}
