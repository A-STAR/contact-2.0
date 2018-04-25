import { Injectable } from '@angular/core';

@Injectable()
export class HelpService {
  // TODO(d.maltsev): should be configurable
  private url = 'https://appserver.luxbase.int/WebContactDoc/ru/index.html';

  open(key: string): void {
    if (key !== null) {
      const suffix = key ? `?${key}.htm` : key;
      window.open(`${this.url}${suffix}`);
    }
  }
}
