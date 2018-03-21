import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  get(key: string): any {
    return window['__CONFIG__'][key];
  }
}
