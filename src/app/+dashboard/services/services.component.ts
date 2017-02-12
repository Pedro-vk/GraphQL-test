import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { ClusterNode, Status, StatusStatus, Service, GraphCoolObject } from '../../shared';

export interface ToggleAllService {
  service: Service;
  status: StatusStatus;
}

@Component({
  selector: 'pgp-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./services.html'),
  styles: [require('./services.scss')],
})
export class ServicesComponent {
  services: Service[] = [];
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();
  @Output() statusAllChange: EventEmitter<ToggleAllService> = new EventEmitter<ToggleAllService>();

  @Input()
  set nodes(nodes: ClusterNode[]) {
    this.services = this.transformNodesToServices(nodes);
  }

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  toggleAllStatus(service: Service, start: boolean): void {
    this.statusAllChange.emit({
      service: service,
      status: start ? 'STARTED' : 'STOPPED',
    });
  }

  trackById(index: number, object: GraphCoolObject): any {
    return object.id || undefined;
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
            let service = Object.assign({}, status.service);
            let newNode: ClusterNode = Object.assign({}, node, {statuses: undefined});
            let newStatus: Status = Object.assign({}, status, {
              service: undefined,
              clusternode: newNode,
            });

            if (!services[service.name]) {
              services[service.name] = service;
              services[service.name].statuses = [];
            }
            services[service.name].statuses.push(newStatus);
          });
      });

    return getValuesOrdered(services);

    function getValuesOrdered(_: any): any[] {
      return Object.keys(_).sort().map((key) => _[key]);
    }
  }
}
