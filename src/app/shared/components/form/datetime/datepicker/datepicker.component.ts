import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '../datetime.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  selector: 'app-datepicker',
  styleUrls: [ './datepicker.component.scss' ],
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent implements ControlValueAccessor, Validator {
  @Input() label: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() required = false;

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _disabled = false;
  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  get disabled(): boolean {
    return this._disabled;
  }

  get value(): Date {
    return this._value;
  }

  writeValue(value: Date | string): void {
    if (value) {
      this._value = value instanceof Date
        ? value
        : moment(value, 'YYYY-MM-DD').toDate();
    } else {
      this._value = null;
    }
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

  validate(c: any): any {
    const value = moment(this._value, 'L');
    switch (true) {
      case this._value && this.minDate && value.isBefore(this.minDate):
        return { min: { minValue: moment(this.minDate).format('L') } };
      case this._value && this.maxDate && value.isAfter(this.maxDate):
        return { max: { maxValue: moment(this.maxDate).format('L') } };
      default:
        return null;
    }
  }

  onTouch(): void {
    this.propagateTouch();
  }

  onChange(date: Date): void {
    this.update(date);
  }

  setCurrentTime(): void {
    const value = new Date();
    this.update(value);
    this.dropdown.close();
  }

  onDateChange(date: Date): void {
    const value = this.dateTimeService.setDate(this._value, date);
    this.update(value);
    this.dropdown.close();
  }

  private update(value: Date): void {
    this._value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
