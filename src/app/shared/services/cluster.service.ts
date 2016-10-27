import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { Observable, Subject } from 'rxjs';

import { ClusterNode, Status, StatusStatus, Tag } from '../interfaces';
import { queries } from '../';

@Injectable()
export class ClusterService {
  private queryPolling: ApolloQueryObservable<ApolloQueryResult>;
  private clusterNodeSubscription: Subject<ClusterNode[]> = new Subject<ClusterNode[]>();
  private clusterNodeObservable: Observable<ClusterNode[]> = this.clusterNodeSubscription.share<ClusterNode[]>();

  constructor(private apollo: Angular2Apollo) {
    this.initNodesPolling();
    this.initStatusPolling();
  }

  getClusterNodeSubscription(): Observable<ClusterNode[]> {
    return this.clusterNodeObservable;
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
    this.queryPolling = this.apollo.watchQuery({
        query: queries.getAllNodes,
        pollInterval: 30 * 1000,
      });

    this.queryPolling
      .subscribe((_: ApolloQueryResult) => {
        this.clusterNodeSubscription.next(_.data.nodes);
      });
  }

  private initStatusPolling(): void {
    this.apollo.watchQuery({
      query: queries.getAllStatus,
      pollInterval: 5 * 1000,
    })
      .subscribe(_ => {});
  }
}
