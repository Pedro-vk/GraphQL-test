import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { queries, ClusterNode, Status, StatusStatus, Service } from '../../shared';

@Component({
  selector: 'pgp-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./services.html'),
  styles: [require('./services.scss')],
})
export class ServicesComponent {
  services: Service[] = [];
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  @Input()
  set nodes(nodes: ClusterNode[]) {
    this.services = this.transformNodesToServices(nodes);
  }

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  private transformNodesToServices(nodes: ClusterNode[]): Service[] {
    if (!nodes || nodes.length === 0) {
      return [];
    }

    let services = {};

    nodes
      .forEach((node: ClusterNode) => {
        node.statuses
          .forEach((status: Status) => {
            let service = status.service;
            let newNode: ClusterNode = Object.assign({}, node, {statuses: undefined});
            let newStatus: Status = Object.assign({}, status, {
              service: undefined,
              clusternode: newNode,
            });

            if (!services[service.id]) {
              services[service.id] = service;
              services[service.id].statuses = [];
            }
            services[service.id].statuses.push(newStatus);
          });
      });

    return getValues(services);

    function getValues(_: any): any[] {
      return Object.keys(_).map((key) => _[key]);
    }
  }
}
