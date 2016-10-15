import { GraphCoolObject } from './graph-cool-object.interface';
import { Status } from './status.interface';
import { Tag } from './tag.interface';

export interface ClusterNode extends GraphCoolObject {
  name: String;
  cores: Number;
  memory: Number;
  localIp: String;
  publicIp: String;
  statuses: Status[];
  tags: Tag[];
}
