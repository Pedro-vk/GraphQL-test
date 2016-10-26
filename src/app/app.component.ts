import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ClusterNode, Status, StatusStatus, Tag } from './shared/interfaces';
import { queries, AttributeCounter } from './shared';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'pgp-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<pgp-dashboard></pgp-dashboard>',
  styles: [require('./app.scss')],
})
export class AppComponent { }
