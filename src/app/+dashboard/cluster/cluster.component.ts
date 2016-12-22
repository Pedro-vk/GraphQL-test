import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { ClusterNode, Status, StatusStatus } from '../../shared';

export interface Cluster {
  location: string;
  clusternodes: ClusterNode[];
}

@Component({
  selector: 'pgp-cluster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./cluster.html'),
  styles: [require('./cluster.scss')],
})
export class ClusterComponent {
  @Input() clusters: Cluster[];
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  @Input()
  set nodes(nodes: ClusterNode[]) {
    this.clusters = this.transformNodesToClusters(nodes);
  }

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  trackCluster(index: number, cluster: Cluster): any {
    return cluster.location || undefined;
  }

  trackNode(index: number, node: ClusterNode): any {
    return node.id || undefined;
  }

  private transformNodesToClusters(nodes: ClusterNode[]): Cluster[] {
    if (!nodes || nodes.length === 0) {
      return [];
    }

    let locations = nodes
      .reduce((acc: any, node: ClusterNode) => {
        if (!acc[node.location]) {
          acc[node.location] = [];
        }
        acc[node.location].push(node);
        return acc;
      }, {});

    return Object.keys(locations)
      .map((location: string) => <Cluster>{
        location: location,
        clusternodes: locations[location],
      })
      .sort((a: Cluster, b: Cluster) => a.location > b.location ? 1 : -1);
  }

}
