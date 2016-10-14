import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus } from './shared/interfaces';
import { queries } from './shared/queries';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-graphql',
  template: require('./app.html'),
  styles: [require('./app.scss')]
})
export class AppComponent implements OnInit {
  private queryPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit(): void {
    this.queryPolling = this.apollo.watchQuery({
        query: queries.getAllNodes,
        pollInterval: 10000
      });

    Observable
      .from<ApolloQueryResult>(this.queryPolling)
      .subscribe((_: ApolloQueryResult) => {
        this.clusterNodeSubscription.next(_.data.nodes);
      });

    this.clusterNodeSubscription
      .subscribe((nodes) => {
        // this.nodes = nodes;
        console.log(nodes);
      });
  }

  toggleStatus(status: Status): void {
    let newStatus: StatusStatus;
    switch (status.status) {
      case 'WAITING': return;
      case 'STARTED': newStatus = 'STOPPED'; break;
      case 'STOPPED': newStatus = 'STARTED'; break;
    }
    this.toggleStatusMutation(status.id, newStatus);
  }

  toggleStatusMutation(statusId: String, status: String): void {
    this.apollo.mutate({
      mutation: queries.updateStatus,
      variables: queries.updateStatus.variables(statusId, status)
    }).then(({ data }: ApolloQueryResult) => {
      console.log('got data', data);
    })
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

  addServiceMutation(nodeId: String, serviceId: String): void {
    this.apollo.mutate({
      mutation: queries.createStatus,
      variables: queries.createStatus.variables(nodeId, serviceId)
    }).then(({ data }: ApolloQueryResult) => {
      console.log('got data', data);
    })
  }
}
