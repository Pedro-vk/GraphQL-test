import { GraphCoolObject } from './graph-cool-object.interface';
import { ClusterNode } from './cluster-node.interface';
import { Service } from './service.interface';

export interface Status extends GraphCoolObject {
  status: 'STOPPED' | 'WAITING' | 'STARTED',
  clusternode: ClusterNode,
  service: Service
}
