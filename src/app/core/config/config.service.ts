import { Injectable } from '@angular/core';
import { getIn } from 'immutable';

import { IConfig } from './config.interface';

@Injectable()
export class ConfigService {
  readonly config: IConfig = window['__CONFIG__'];

  getThirdPartyOperationUrl(id: number): string {
    return getIn(this.config, [ 'customOperations', id, 'url' ], null);
  }
}
