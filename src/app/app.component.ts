import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pgp-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<pgp-dashboard></pgp-dashboard>',
  styles: [require('./app.scss')],
})
export class AppComponent { }
