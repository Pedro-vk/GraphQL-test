import { GraphCoolObject } from './graph-cool-object.interface';
import { Status } from './status.interface';

export interface Service extends GraphCoolObject {
  name: String;
  description: String;
  statuses: Status[];
}
