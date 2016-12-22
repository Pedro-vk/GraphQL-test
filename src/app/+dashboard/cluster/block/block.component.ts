import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { queries, ClusterNode, Status, StatusStatus, GraphCoolObject } from '../../../shared';

@Component({
  selector: 'pgp-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./block.html'),
  styles: [require('./block.scss')],
})
export class BlockComponent {
  @Input() details: ClusterNode;
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  toggleStatus(status: Status): void {
    this.statusChange.emit(status);
  }

  trackById(index: number, object: GraphCoolObject): any {
    return object.id || undefined;
  }
}
