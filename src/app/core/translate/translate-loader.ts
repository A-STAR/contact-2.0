import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ConfigService } from '@app/core/config/config.service';

export class AppTranslateLoader implements TranslateLoader {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {}

  getTranslation(lang: string): Observable<any> {
    const urls = this.configService.config.i18n.map(url => url.replace('{lang}', lang));
    return urls.length
      ? this.httpClient.get(urls[0])
      : of({});
  }
}
