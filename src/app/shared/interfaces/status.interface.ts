import { GraphCoolObject } from './graph-cool-object.interface';
import { ClusterNode } from './cluster-node.interface';
import { Service } from './service.interface';

export type StatusStatus = 'STOPPED' | 'WAITING' | 'STARTED';

export interface Status extends GraphCoolObject {
  status: StatusStatus;
  clusternode: ClusterNode;
  service: Service;
}
