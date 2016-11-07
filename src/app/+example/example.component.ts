import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ClusterNode, Status, StatusStatus, Tag } from '../shared/interfaces';
import { Observable, Subject } from 'rxjs';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

import { Service } from '../shared';

const query = gql`
  query getServices {
    services: allServices {
      name
      description
      statuses {
        status
        clusternode {
          name
          location
        }
      }
    }
  }
`;

@Component({
  selector: 'pgp-example',
  template: require('./example.html'),
  styles: [require('./example.scss')],
})
export class ExampleComponent implements OnInit {
  services: Observable<Service[]>;

  constructor(private apollo: Angular2Apollo) { }

  ngOnInit(): void {
    this.services = this.apollo
      .watchQuery({
        query: query,
        pollInterval: 500,
      })
      .map((_: any) => _.data.services);
  }
}
