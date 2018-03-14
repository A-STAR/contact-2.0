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
  @Input() minDate: Date;
  @Input() maxDate: Date;

  page = moment();
  value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  getClass(date: moment.Moment): object {
    return {
      disabled: this.isDateDisabled(date),
      current: moment().startOf('day').isSame(date),
      outside: date.isBefore(this.page.startOf('month'), 'day') || date.isAfter(this.page.endOf('month'), 'day'),
      selected: moment(this.value).startOf('day').isSame(date),
    };
  }

  writeValue(value: Date): void {
    this.value = value;
    if (value) {
      this.page = moment(value);
    }
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    // this.propagateTouch = fn;
  }

  onClick(date: moment.Moment): void {
    if (!this.isDateDisabled(date)) {
      this.value = date.toDate();
      this.propagateChange(this.value);
      this.cdRef.markForCheck();
    }
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

  private isDateDisabled(date: moment.Moment): boolean {
    return (this.minDate && date.isBefore(this.minDate, 'day')) || (this.maxDate && date.isAfter(this.maxDate, 'day'));
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
