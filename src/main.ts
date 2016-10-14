/// <reference path="./custom-typings.d.ts"/>

import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';


import { } from './app';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
