import { print } from 'graphql-tag/printer';

export function addGraphQLSubscriptions(networkInterface: any, wsClient: any): any {
  if (!networkInterface) {
    throw new TypeError('addGraphQLSubscriptions requires a networkInterface');
  }

  if (!wsClient) {
    throw new TypeError('addGraphQLSubscriptions requires a wsClient');
  }

  return Object.assign(networkInterface, {
    subscribe(request: any, cb: any): any {
      return wsClient.subscribe(Object.assign({}, request, {
        query: print(request.query),
      }), cb);
    },
    unsubscribe(id: any): any {
      wsClient.unsubscribe(id);
    },
  });
}
