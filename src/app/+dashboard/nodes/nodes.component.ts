import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { queries, ClusterNode, Status, StatusStatus } from '../../shared';

@Component({
  selector: 'pgp-nodes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./nodes.html'),
  styles: [require('./nodes.scss')],
})
export class NodesComponent {
  @Input() nodes: ClusterNode[];
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  trackNode(index: number, node: ClusterNode) {
    return node.id || undefined;
  }
}
