import { GraphCoolObject } from './graph-cool-object.interface';
import { Status } from './status.interface';

export interface ClusterNode extends GraphCoolObject {
  name: String,
  localIp: String,
  publicIp: String,
  statuses: Status[]
}
