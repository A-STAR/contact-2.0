import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { LongDateFormatKey } from 'moment';

import { DateTimeService } from '../datetime.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    }
  ],
  selector: 'app-datetime-input',
  templateUrl: './input.component.html'
})
export class DateTimeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() format: string;

  private _disabled = false;
  private _value: Date;

  private langSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.langSub = this.translateService.onLangChange.subscribe(() => this.cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get mask(): any {
    return this.dateTimeService.getMaskParamsFromMomentFormat(this.formatString);
  }

  get momentValue(): moment.Moment {
    return moment(this._value);
  }

  get formatString(): string {
    const { currentLang, defaultLang } = this.translateService;
    const lang = currentLang || defaultLang;
    return this.format
      .split(' ')
      .map(format => moment.localeData(lang).longDateFormat(format as LongDateFormatKey) || format)
      .join(' ');
  }

  writeValue(value: Date): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
  }

  onBlur(): void {
    this.propagateTouch();
  }

  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLInputElement;
    const delta = Math.sign(event.deltaY);
    const start = target.selectionStart;
    console.log(delta, start);
  }

  onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const date = moment(value, this.formatString);
    if (date.isValid()) {
      this.update(date.toDate());
    }
  }

  private update(value: Date): void {
    this._value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
