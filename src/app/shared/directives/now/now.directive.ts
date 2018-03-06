import { OnInit, OnDestroy, Directive, Input, ElementRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import * as moment from 'moment';

@Directive({
  selector: '[appNow]'
})
export class NowDirective implements OnInit, OnDestroy {
  @Input() format;

  intervalId;
  private currentLang: string;
  private langSub: Subscription;

  constructor(
    private element: ElementRef,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {

    this.currentLang = this.translateService.currentLang || this.translateService.defaultLang;
    this.langSub = this.translateService.onLangChange.subscribe((params: LangChangeEvent) => {
      this.currentLang = params.lang;
    });

    this.updateTime();
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 1000);
    });
  }

  updateTime(): void {
    const dt = moment().locale(this.currentLang).format(this.format);
    this.element.nativeElement.innerHTML = dt;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}
