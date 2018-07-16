import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app/app.module';

import { IConfig } from '@app/core/config/config.interface';

import { environment } from './environments/environment';
import { load } from 'config';

if (environment.production) {
  enableProdMode();
}

load('/assets/server/root.json')
  .then((config: IConfig) => {
    window['__CONFIG__'] = config;
    LicenseManager.setLicenseKey(config.licenses.agGrid);
    platformBrowserDynamic().bootstrapModule(AppModule);
  })
  .catch(error => console.error(error));
