import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { queries, ClusterNode, Status, StatusStatus, GraphCoolObject } from '../../../shared';

@Component({
  selector: 'pgp-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./node.html'),
  styles: [require('./node.scss')],
})
export class NodeComponent {
  @Input() details: ClusterNode;
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  trackById(index: number, object: GraphCoolObject): any {
    return object.id || undefined;
  }
}
