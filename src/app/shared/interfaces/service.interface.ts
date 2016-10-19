import { GraphCoolObject } from './graph-cool-object.interface';
import { Status } from './status.interface';

export interface Service extends GraphCoolObject {
  name: string;
  description: string;
  statuses: Status[];
}
