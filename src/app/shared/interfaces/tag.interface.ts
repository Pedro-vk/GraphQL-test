import { GraphCoolObject } from './graph-cool-object.interface';
import { ClusterNode } from './cluster-node.interface';

export interface Tag extends GraphCoolObject {
  name: string;
  clusternodes: ClusterNode;
}
