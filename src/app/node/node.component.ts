import { Component, ChangeDetectionStrategy, Input, EventEmitter } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';

import { queries, ClusterNode, Status, StatusStatus } from '../shared';

@Component({
  selector: 'Node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./node.html'),
  styles: [require('./node.scss')]
})
export class NodeComponent {
  @Input() details: ClusterNode;

  constructor(private apollo: Angular2Apollo) {}

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
}
