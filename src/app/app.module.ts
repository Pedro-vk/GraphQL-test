import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'angular2-apollo';

import { AppComponent }  from './app.component';
import { appComponents } from './';
import { GraphCoolObject, pipes }  from './shared';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('https://api.graph.cool/simple/v1/ciu5o9tpz0jg101483bjlp75g'),
  dataIdFromObject: (_: GraphCoolObject): any => _.id,
  shouldBatch: true,
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

@NgModule({
  imports: imports,
  declarations: declarations,
  bootstrap: [ AppComponent ],
})
export class AppModule {

}
