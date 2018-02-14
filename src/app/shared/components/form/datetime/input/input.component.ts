import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  templateUrl: './input.component.html',
})
export class DateTimeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() format: string;
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  private _disabled = false;
  private _value: Date;

  private cachedValue: moment.Moment = null;
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
    const delta = -Math.sign(event.deltaY);
    const cursorPosition = target.selectionStart;
    const char = this.formatString[cursorPosition];
    const letter = char && /\w/.test(char) ? char : this.formatString[cursorPosition - 1];
    const modifier = this.dateTimeService.getModifierFromMomentFormatLetter(letter);
    this.cachedValue = moment(this.cachedValue || this._value || new Date()).clone().add(delta, modifier);
    const value = this.cachedValue.format(this.formatString);
    target.value = value;
    target.setSelectionRange(cursorPosition, cursorPosition);
    this.propagateChange(this.cachedValue.toDate());
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    let date = moment(target.value, this.formatString);
    if (this.minDateTime && moment(date.toDate()).isBefore(this.minDateTime)) {
      date = moment(this.minDateTime, this.formatString);
    }

    if (date.isValid()) {
      this.update(date.toDate());
      target.value = date.format(this.formatString);
    }
  }

  @HostListener('focusout')
  focusOut(): void {
    if (this.cachedValue) {
      this.update(this.cachedValue.toDate());
      this.cachedValue = null;
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
