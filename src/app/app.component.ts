import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus, Tag } from './shared/interfaces';
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
    this.clusterNodeSubscription
      .map((nodes: ClusterNode[]): any => {
        return nodes
          .reduce((acc: any, node: ClusterNode) => {
            acc.cores[node.cores] = (acc.cores[node.cores] || 0) + 1;
            acc.memory[node.memory] = (acc.memory[node.memory] || 0) + 1;
            node.tags
              .forEach((tag: Tag) => {
                acc.tags[tag.name] = (acc.tags[tag.name] || 0) + 1;
              })
            return acc;
          }, {
            cores: {},
            memory: {},
            tags: {},
          });
      })
      .subscribe((_: any) => console.log(_));
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

  toggleStatusMutation(statusId: String, status: StatusStatus): void {
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

  addServiceMutation(nodeId: String, serviceId: String): void {
    this.apollo.mutate({
      mutation: queries.createStatus,
      variables: queries.createStatus.variables(nodeId, serviceId)
    }).then(({ data }: ApolloQueryResult) => {
      console.log('got data', data);
    })
  }
}
