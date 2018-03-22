import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';

import { ConfigService } from '@app/core/config/config.service';

export class AppTranslateLoader implements TranslateLoader {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {}

  getTranslation(lang: string): Observable<any> {
    const urls = this.configService.config.i18n.map(url => {
      return this.httpClient.get(url.replace('{lang}', lang));
    });

    return forkJoin(...urls).pipe(
      map(files => jQuery.extend(true, ...files.map(f => f || {}))),
    );
  }
}
