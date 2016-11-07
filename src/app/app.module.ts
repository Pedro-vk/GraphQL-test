import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'angular2-apollo';

import { AppComponent }  from './app.component';
import { ExampleComponent }  from './+example/example.component';


const client = new ApolloClient({
  networkInterface: createNetworkInterface('https://api.graph.cool/simple/v1/ciu5o9tpz0jg101483bjlp75g'),
  dataIdFromObject: (_: any): any => _.id,
  shouldBatch: true,
});

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ApolloModule.withClient(client),
  ],
  declarations: [
    AppComponent,
    ExampleComponent
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {

}
