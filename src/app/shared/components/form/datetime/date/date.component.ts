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

  getClass(date: moment.Moment): object {
    return {
      outside: date.isBefore(this.page.startOf('month')) || date.isAfter(this.page.endOf('month')),
      current: moment().startOf('day').isSame(date),
      selected: moment(this._value).startOf('day').isSame(date),
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

  /**
   * This fixes a slightly less than obvious bug:
   * Without tracking, on date click datepicker dropdown closes due to changed reference to event target.
   */
  trackDateBy(index: number): number {
    return index;
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
