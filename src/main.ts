/// <reference path="./custom-typings.d.ts"/>

import { enableProdMode, NgModuleRef } from '@angular/core';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';
import { hotBootstrap } from './hmr';

const minLoadingDelay: number = 2000;

if (process.env.ENV === 'production') {
  enableProdMode();
}

function bootstrap(): Promise<NgModuleRef<any>> {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}
function afterLoading(onLoaded: () => void): void {
  setTimeout(() => {
    let loadingElement = document.querySelector('.loading');
    if (loadingElement) {
      loadingElement.classList.add('loading--hidden');
    }
    onLoaded();
  }, minLoadingDelay - Date.now() + (<any>window).loadingStart);
};

if ((<any>module).hot) {
  afterLoading(() => hotBootstrap(module, bootstrap));
} else {
  afterLoading(() => bootstrap());
}
