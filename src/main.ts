import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app/app.module';

import { IConfig } from '@app/core/config/config.interface';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// tslint:disable-next-line
LicenseManager.setLicenseKey('CRIF_LLC_Contact_Collection_Solution_1Devs19_February_2019__MTU1MDUzNDQwMDAwMA==19f9da3e1e632091854eee1e76adf484');

// This isn't pretty but there is no other way to inject values dynamically
const request = new XMLHttpRequest();
request.onload = () => {
  const { response } = request;
  if (!response) {
    throw new Error('Could not get config');
  }

  const domain = response.url.match(/:\/\/(.+)$/)[1];
  if (!domain) {
    throw new Error('Could not get domain config');
  }

  const config: IConfig = {
    api: {
      http: response.url,
      ws: response.ws,
    },
    domains: [ domain ],
  };

  window['__CONFIG__'] = config;

  platformBrowserDynamic().bootstrapModule(AppModule).then(() => {});
};

request.open('GET', '/assets/server/root.json');
request.responseType = 'json';
request.send();
