import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
  selector: 'app-date',
  styleUrls: [ './date.component.scss' ],
  templateUrl: './date.component.html'
})
export class DateComponent implements ControlValueAccessor {
  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get range(): moment.Moment[] {
    const n = this.lastDay.diff(this.firstDay, 'days') || 0;
    return Array(n + 1).fill(null).map((_, i) => this.firstDay.clone().add(i, 'd'));
  }

  get month(): string {
    return this.moment.format('MMMM');
  }

  get year(): string {
    return this.moment.format('YYYY');
  }

  get value(): Date {
    return this._value;
  }

  getDay(date: moment.Moment): string {
    return date.format('D');
  }

  getDayName(date: moment.Moment): string {
    return date.format('ddd');
  }

  getClass(date: moment.Moment): object {
    return {
      outside: date.isBefore(this.firstDayOfMonth) || date.isAfter(this.lastDayOfMonth),
      current: date.startOf('day').isSame(this.now.startOf('day')),
      selected: date.startOf('day').isSame(this._value),
    };
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

  onClick(date: moment.Moment): void {
    this._value = date.toDate();
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  private get firstDay(): moment.Moment {
    return this.firstDayOfMonth.startOf('week');
  }

  private get lastDay(): moment.Moment {
    return this.lastDayOfMonth.endOf('week');
  }

  private get firstDayOfMonth(): moment.Moment {
    return this.moment.startOf('month');
  }

  private get lastDayOfMonth(): moment.Moment {
    return this.moment.endOf('month');
  }

  private get moment(): moment.Moment {
    // TODO(d.maltsev): get locale from service
    return moment(this._value).locale('ru');
  }

  private get now(): moment.Moment {
    return moment();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
