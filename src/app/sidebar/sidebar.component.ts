import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';

@Component({
  selector: 'Sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./sidebar.html'),
  styles: [require('./sidebar.scss')]
})
export class SidebarComponent {
  @Input() filters: any = {};

  constructor() {}
}
