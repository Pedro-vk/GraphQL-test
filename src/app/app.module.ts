import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'angular2-apollo';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('https://api.graph.cool/simple/v1/ciu5o9tpz0jg101483bjlp75g'),
});

@NgModule({
  imports: [
    BrowserModule,
    ApolloModule.withClient(client)
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
