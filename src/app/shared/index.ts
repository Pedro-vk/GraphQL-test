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

export const Pipes = [
  KeysPipe,
];

export { queries } from './queries';

export { AttributeCounter } from './attribute-counter';

