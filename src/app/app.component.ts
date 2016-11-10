import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { onInitAnimation } from './app.animations';

@Component({
  selector: 'pgp-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<pgp-dashboard [@appVisibility]="visibilityState"></pgp-dashboard>',
  styles: [require('./app.scss')],
  animations: [
    onInitAnimation,
  ],
})
export class AppComponent implements AfterViewInit {
  visibilityState: string = 'initial';

  ngAfterViewInit(): void {
    this.visibilityState = 'visible';
  }
}
