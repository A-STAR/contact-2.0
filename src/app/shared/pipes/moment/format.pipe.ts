import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Pipe({
  name: 'momentFormat',
  pure: false,
})
export class MomentFormatPipe implements OnDestroy, PipeTransform {
  private formattedValue: string;
  private langSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    this.langSub = this.translateService.onLangChange.subscribe(() => this.cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  transform(value: moment.Moment, format: string): string {
    const { currentLang, defaultLang } = this.translateService;
    const lang = currentLang || defaultLang;
    this.formattedValue = value.locale(lang).format(format);
    return this.formattedValue;
  }
}
