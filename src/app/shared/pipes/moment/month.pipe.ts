import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Pipe({
  name: 'momentMonth',
  pure: false,
})
export class MomentMonthPipe implements OnDestroy, PipeTransform {
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

  transform(value: moment.Moment, format: string): moment.Moment[] {
    const { currentLang, defaultLang } = this.translateService;
    const lang = currentLang || defaultLang;
    const firstDay = value.clone().locale(lang).startOf('month').startOf('week');
    const lastDay = value.clone().locale(lang).endOf('month').endOf('week');
    const n = lastDay.diff(firstDay, 'days') || 0;
    return Array(n + 1).fill(null).map((_, i) => firstDay.clone().add(i, 'd'));
  }
}
