import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ILanguage } from './translator.interface';

@Injectable()
export class TranslatorService {

  private defaultLanguage = 'ru';
  private availableLangs: ILanguage[];

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.defaultLanguage);

    this.availableLangs = [
      { code: 'en', text: 'English' },
      { code: 'ru', text: 'Russian' }
    ];

    this.useLanguage();
  }

  useLanguage(lang: string = this.defaultLanguage): Observable<boolean> {
    return this.translate.use(lang);
  }

  getAvailableLanguages(): ILanguage[] {
    return this.availableLangs;
  }

  // return the code of the currently selected language
  getCurrentLang(): string {
    return this.translate.currentLang;
  }

}
