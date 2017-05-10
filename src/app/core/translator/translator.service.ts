import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslatorService {

  private defaultLanguage = 'en';
  private availableLangs: any;

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.defaultLanguage);

    this.availableLangs = [
      { code: 'en', text: 'English' },
      { code: 'es_AR', text: 'Spanish' }
    ];
  }

  useLanguage(lang = this.defaultLanguage): Observable<boolean> {
    return this.translate.use(lang);
  }

  getAvailableLanguages() {
    return this.availableLangs;
  }

}
