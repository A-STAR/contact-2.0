import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import {LicenseManager} from 'ag-grid-enterprise/main';
// tslint:disable-next-line
LicenseManager.setLicenseKey('CRIF_LLC_Contact_Collection_Solution_1Devs19_February_2019__MTU1MDUzNDQwMDAwMA==19f9da3e1e632091854eee1e76adf484');

// This isn't pretty but there is no other way to inject values dynamically
window['__CONFIG__'] = {
  domains: [
    '*',
    'localhost:4200',
    'localhost:8080',
    'appservertest.luxbase.int:4100',
    'appservertest.luxbase.int:4300',
    'appservertest.luxbase.int:4400',
    'go.luxbase.ru:3000',
    'go.luxbase.ru:4300',
  ],
};

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {});
