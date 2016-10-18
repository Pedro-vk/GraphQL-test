import { GraphCoolObject } from './graph-cool-object.interface';
import { Status } from './status.interface';
import { Tag } from './tag.interface';

export interface ClusterNode extends GraphCoolObject {
  name: string;
  cores: number;
  memory: number;
  localIp: string;
  publicIp: string;
  location: string;
  statuses: Status[];
  tags: Tag[];
}
