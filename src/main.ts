import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app/app.module';

import { environment } from './environments/environment';
import { load } from 'config';

if (environment.production) {
  enableProdMode();
}

// tslint:disable-next-line
LicenseManager.setLicenseKey('CRIF_LLC_Contact_Collection_Solution_1Devs19_February_2019__MTU1MDUzNDQwMDAwMA==19f9da3e1e632091854eee1e76adf484');

load('/assets/server/root.json')
  .then(config => {
    window['__CONFIG__'] = config;
    platformBrowserDynamic().bootstrapModule(AppModule);
  })
  .catch(error => console.error(error));
