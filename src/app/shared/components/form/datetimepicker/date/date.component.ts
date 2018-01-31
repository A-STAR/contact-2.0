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
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  private _value: Date;

  page = moment();

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get range(): moment.Moment[] {
    const firstDay = this.page.clone().startOf('month').startOf('week');
    const lastDay = this.page.clone().endOf('month').endOf('week');
    const n = lastDay.diff(firstDay, 'days') || 0;
    return Array(n + 1).fill(null).map((_, i) => firstDay.clone().add(i, 'd'));
  }

  // get value(): Date {
  //   return this._value;
  // }

  getClass(date: moment.Moment): object {
    return {
      outside: date.isBefore(this.page.clone().startOf('month')) || date.isAfter(this.page.clone().endOf('month')),
      current: date.startOf('day').isSame(moment().startOf('day')),
      selected: date.startOf('day').isSame(this._value),
    };
  }

  writeValue(value: Date): void {
    this._value = value;
    if (value) {
      this.page = moment(value);
    }
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // this.propagateTouch = fn;
  }

  onClick(date: moment.Moment): void {
    this._value = date.toDate();
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  showNextMonth(): void {
    this.page.add(1, 'M');
  }

  showPrevMonth(): void {
    this.page.subtract(1, 'M');
  }

  showNextYear(): void {
    this.page.add(1, 'y');
  }

  showPrevYear(): void {
    this.page.subtract(1, 'y');
  }

  // TODO(d.maltsev): this should probably be a pipe
  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
