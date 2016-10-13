import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
