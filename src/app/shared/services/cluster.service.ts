import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { Observable, Subject } from 'rxjs';

import { ClusterNode, Status, StatusStatus, Tag } from '../interfaces';
import { queries } from '../';
import { getClusterState } from '../../../hmr';

@Injectable()
export class ClusterService {
  private clusterNodeLastValue: ClusterNode[] = getClusterState();
  private nodesPolling: ApolloQueryObservable<ApolloQueryResult>;
  private statusPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();
  private clusterNodeObservable: Observable<ClusterNode[]> = this.clusterNodeSubscription.share<ClusterNode[]>();

  constructor(private apollo: Angular2Apollo) {
    this.initNodesPolling();
    this.initStatusPolling();
  }

  destroy(): void {
    this.nodesPolling.stopPolling();
    this.statusPolling.stopPolling();
  }

  getClusterNodeLastValue(): ClusterNode[] {
    return this.clusterNodeLastValue;
  }

  getClusterNodeSubscription(): Observable<ClusterNode[]> {
    if (getClusterState()) {
      return this.clusterNodeObservable
        .startWith<ClusterNode[]>(getClusterState());
    } else {
      return this.clusterNodeObservable;
    }
  }

  getAllTags(): Promise<Tag[]> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: queries.getAllTags,
        })
        .then((response: any) => {
          let tags = response.data.tags;
          resolve(tags);
        });
    });
  }

  updateStatus(statusId: string, status: StatusStatus): void {
    this.updateStatusMutation(statusId, 'WAITING');
    setTimeout(() => this.updateStatusMutation(statusId, status), 500 + 3000 * Math.random());
  }

  private updateStatusMutation(statusId: string, status: StatusStatus): void {
    this.apollo.mutate({
      mutation: queries.updateStatus,
      variables: queries.updateStatus.variables(statusId, status),
    });
  }

  private initNodesPolling(): void {
    this.nodesPolling = this.apollo.watchQuery({
        query: queries.getAllNodes,
        pollInterval: 30 * 1000,
      });

    this.nodesPolling
      .subscribe((_: ApolloQueryResult) => {
        this.clusterNodeSubscription.next(_.data.nodes);
        this.clusterNodeLastValue = _.data.nodes;
      });
  }

  private initStatusPolling(): void {
    this.statusPolling = this.apollo.watchQuery({
      query: queries.getAllStatus,
      pollInterval: 5 * 1000,
    });
    this.statusPolling
      .subscribe(_ => {});
  }
}
