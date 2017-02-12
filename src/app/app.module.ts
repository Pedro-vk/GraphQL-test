import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

import { AppComponent }  from './app.component';
import { appComponents } from './';
import { GraphCoolObject, pipes, services }  from './shared';

const client = new ApolloClient({
  networkInterface: createBatchingNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/ciu5o9tpz0jg101483bjlp75g',
    batchInterval: 100,
  }),
  dataIdFromObject: (_: GraphCoolObject): any => _.id,
});

export function provideClient(): ApolloClient {
  return client;
}

export const imports = [
  BrowserModule,
  FormsModule,
  ApolloModule.forRoot(provideClient),
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
