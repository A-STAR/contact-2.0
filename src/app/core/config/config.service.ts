import { Injectable } from '@angular/core';

import { IConfig } from './config.interface';

@Injectable()
export class ConfigService {
  readonly config: IConfig;

  constructor() {
    this.config = window['__CONFIG__'];
  }
}
