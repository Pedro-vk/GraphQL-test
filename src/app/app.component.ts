import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pgp-app',
  encapsulation: ViewEncapsulation.None,
  template: '<pgp-example></pgp-example>',
  styles: [require('./app.scss')],
})
export class AppComponent { }
