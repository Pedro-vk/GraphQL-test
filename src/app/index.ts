import { dashboardComponents } from './+dashboard';

export const appComponents = [
  ...dashboardComponents,
];

export { AppModule } from './app.module';


/* tslint:disable */
/*

    # Node creation

    Array(12).fill()
      .map((_, i) => i + 51)
      .forEach(_ => {
        this.apollo.mutate({
          mutation: gql`
            mutation addNode($name: String!, $ip: String!, $memory: Int!, $cores: Int!) {
              createClusterNode(
                name: $name,
                localIp: $ip,
                memory: $memory,
                cores: $cores) {

                id
              }
            }
          `,
          variables: {
            name: `fe0${_}`,
            ip: `10.0.10.${_}`,
            memory: 64,
            cores: 12,
          }
        }).then(({ data }) => {
          this.apollo.mutate({
            mutation: gql`
              mutation setNodeAttrs($nodeId: ID!, $serviceId: ID!, $serviceId2: ID!, $tagSize: ID!, $tagRole: ID!, $tagRole2: ID!) {
                tagSize: addToNodeTags(clusternodesClusterNodeId: $nodeId, tagsTagId: $tagSize) { clusternodesClusterNode { id } }
                tagRole: addToNodeTags(clusternodesClusterNodeId: $nodeId, tagsTagId: $tagRole) { clusternodesClusterNode { id } }
                tagRole2: addToNodeTags(clusternodesClusterNodeId: $nodeId, tagsTagId: $tagRole2) { clusternodesClusterNode { id } }
                service: createStatus(clusternodeId: $nodeId, serviceId: "ciu5ph93y018s0151hy19yq6g") { id }
                service1: createStatus(clusternodeId: $nodeId, serviceId: $serviceId) { id }
                service2: createStatus(clusternodeId: $nodeId, serviceId: $serviceId2) { id }
              }
            `,
            variables: {
              nodeId: data.createClusterNode.id,
              serviceId: "ciu5zu6ze02vm0150zwwl4xgz",
              serviceId2: "ciuagmkdn0jjn01240cqbuy59",
              tagSize: "ciue75tht13f80165xbpoiefs",
              tagRole: "ciuaglymx0jjb0165h11ggw92",
              tagRole2: "ciuaglu880jjf0124f1bqsweu",
            }
          })
        });
      })

 */
