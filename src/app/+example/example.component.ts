import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { ClusterNode, Status, StatusStatus, Tag } from '../shared/interfaces';
import { Observable } from 'rxjs';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

import { Service } from '../shared';

const query = gql`
  query getServices {
    services: allServices {
      id
      name
      description
      statuses {
        id
        status
        clusternode {
          id
          name
          location
        }
      }
    }
  }
`;

const mutation = gql`
  mutation updateStatus($id: ID!, $status: STATUS_STATUS!) {
    updateStatus(id: $id, status: $status) {
      id
      status
      clusternode {
        id
        name
      }
      service {
        id
        name
      }
    }
  }
`;

@Component({
  selector: 'pgp-example',
  encapsulation: ViewEncapsulation.None,
  template: require('./example.html'),
  styles: [require('../app.scss'), require('./example.scss')],
})
export class ExampleComponent implements OnInit {
  services: Observable<Service[]>;

  constructor(private apollo: Angular2Apollo) { }

  ngOnInit(): void {
    this.services = this.apollo
      .watchQuery({
        query: query,
        pollInterval: 10000
      })
      .map((_: any) => _.data.services);
  }

  changeStatus(status: Status) {
    let newStatus = status.status === 'STARTED' ? 'STOPPED' : 'STARTED';
    this.apollo
      .mutate({
        mutation: mutation,
        variables: {
          id: status.id,
          status: newStatus,
        }
      });
  }
}
