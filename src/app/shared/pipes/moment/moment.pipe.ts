import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
  pure: false,
})
export class MomentPipe implements OnDestroy, PipeTransform {
  private formattedValue: string;
  private langSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  transform(value: moment.Moment, format: string): string {
    const { currentLang, defaultLang, onLangChange } = this.translateService;
    const lang = currentLang || defaultLang;
    this.update(value, format, lang);
    this.langSub = onLangChange.subscribe(event => this.update(value, format, event.lang));
    return this.formattedValue;
  }

  private update(value: moment.Moment, format: string, lang: string): void {
    const locales = moment.locales();
    const locale = locales.includes(lang)
      ? lang
      : locales[0];
    this.formattedValue = value.locale(locale).format(format);
    this.cdRef.markForCheck();
  }
}
