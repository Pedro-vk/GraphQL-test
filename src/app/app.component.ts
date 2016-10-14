import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import gql from 'graphql-tag';
import { ClusterNode } from './shared/interfaces';
import { Observable, Subject } from 'rxjs';

const queryGetAllNodesWithStatus = gql`
  query nodes {
    nodes: allClusterNodes {
      id
      name
      localIp
      statuses {
        status
        service {
          id
          name
        }
      }
    }
  }
`;

const queryAddServiceToNode = gql`
  mutation addServiceToNode($nodeId: ID!, $serviceId: ID!) {
    createStatus(
      status: STOPPED,
      clusternodeId: $nodeId,
      serviceId: $serviceId) {
      id
    }
  }
`;

@Component({
  selector: 'app-graphql',
  template: `
    <h1>GraphQL - Test</h1>
    <button (click)="addServices()">AddServices</button>

    <br><br>

    <div *ngFor="let node of clusterNodeSubscription | async; let i = index">
      {{node.name}} ({{node.localIp}})

      <div *ngFor="let status of node.statuses; let i = index">
        [{{status.status}}] {{status.service.name}}

        <span>

        </span>

      </div>

      <br>
    </div>
  `
})
export class AppComponent implements OnInit {
  private queryPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit(): void {
    this.queryPolling = this.apollo.watchQuery({
        query: queryGetAllNodesWithStatus,
        pollInterval: 2000
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

  toggleServiceStatus(): void {

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
      mutation: queryAddServiceToNode,
      variables: {
        nodeId,
        serviceId
      }
    }).then(({ data }: ApolloQueryResult) => {
      console.log('got data', data);
    })
  }
}
