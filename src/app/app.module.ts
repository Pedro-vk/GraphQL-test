import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'angular2-apollo';
import { Client } from 'subscriptions-transport-ws';

import { AppComponent }  from './app.component';
import { appComponents } from './';
import { GraphCoolObject, pipes, services, addGraphQLSubscriptions }  from './shared';


const wsClient = new Client('ws://subscriptions.graph.cool/ciu5o9tpz0jg101483bjlp75g');
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/ciu5o9tpz0jg101483bjlp75g',
  // batchInterval: 20,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: (_: GraphCoolObject): any => _.id,
});

export const imports = [
  BrowserModule,
  FormsModule,
  ApolloModule.withClient(client),
];

export const declarations = [
  AppComponent,
  ...appComponents,
  ...pipes,
];

export const providers = [
  ...services,
];

@NgModule({
  imports: imports,
  declarations: declarations,
  providers: providers,
  bootstrap: [ AppComponent ],
})
export class AppModule {

}
