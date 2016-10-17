export {
  GraphCoolObject,
  ClusterNode,
  Service,
  Status, StatusStatus,
  Tag
} from './interfaces'

import * as Interfaces from './interfaces';

export const interfaces = Interfaces;

import { KeysPipe } from './keys.pipe';
export { KeysPipe };

import { OrderByOnSidebarPipe } from './order-by-on-sidebar.pipe';
export { OrderByOnSidebarPipe };

export const Pipes = [
  KeysPipe,
  OrderByOnSidebarPipe,
];

export { queries } from './queries';

export { AttributeCounter } from './attribute-counter';

