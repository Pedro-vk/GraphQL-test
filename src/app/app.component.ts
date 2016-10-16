import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus, Tag } from './shared/interfaces';
import { queries } from './shared/queries';
import { AttributeCounter } from './shared';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-graphql',
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
      });

    Observable
      .from<ApolloQueryResult>(this.queryPolling)
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

  toggleStatus(status: Status): void {
    let newStatus: StatusStatus;
    switch (status.status) {
      case 'WAITING': return;
      case 'STARTED': newStatus = 'STOPPED'; break;
      case 'STOPPED': newStatus = 'STARTED'; break;
    }
    this.toggleStatusMutation(status.id, 'WAITING');
    setTimeout(() => this.toggleStatusMutation(status.id, newStatus), 500 + 3000 * Math.random());
  }

  toggleStatusMutation(statusId: string, status: StatusStatus): void {
    this.apollo.mutate({
      mutation: queries.updateStatus,
      variables: queries.updateStatus.variables(statusId, status)
    });
  }

  addServices(): void {
    //return;

    // Mesos : ciu5ph93y018s0151hy19yq6g
    // MongoDB : ciu5zu6ze02vm0150zwwl4xgz
    // Cassandra : ciu5pgrji01al0150aldsza8p

    // this.nodes
    //   .filter((_, index) => index === 7)
    //   .forEach(_ => this.addServiceMutation(_.id, 'ciu5pgrji01al0150aldsza8p'));
  }

  addServiceMutation(nodeId: string, serviceId: string): void {
    this.apollo.mutate({
      mutation: queries.createStatus,
      variables: queries.createStatus.variables(nodeId, serviceId)
    }).then(({ data }: ApolloQueryResult) => {
      console.log('got data', data);
    })
  }
}
