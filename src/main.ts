/// <reference path="./custom-typings.d.ts"/>

import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';
import { hotBootstrap } from './hmr';


import { } from './app';

if (process.env.ENV === 'production') {
  enableProdMode();
}
function bootstrap() {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

if ((<any>module).hot) {
  hotBootstrap(module, bootstrap);
} else {
	bootstrap();
}
