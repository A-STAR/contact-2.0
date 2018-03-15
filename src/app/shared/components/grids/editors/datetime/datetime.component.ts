import { Component, forwardRef, Input, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateTimeService } from '@app/shared/components/form/datetime/datetime.service';

import * as moment from 'moment';

@Component({
  selector: 'app-grid-datetime-edit',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeEditComponent),
      multi: true,
    },
  ],
})
export class DateTimeEditComponent implements ControlValueAccessor {
  @Input() required = false;
  @Input() set displaySeconds(displaySeconds: boolean) {
    this._displaySeconds = displaySeconds === undefined ? true : displaySeconds;
    this.dateTimeFormat = this._displaySeconds ? 'L HH:mm:ss' : 'L HH:mm';
  }

  dateTimeFormat = 'L HH:mm:ss';

  value: Date;
  tempValue: Date;

  private _displaySeconds: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  get displaySeconds(): boolean {
    return this._displaySeconds;
  }

  writeValue(value: Date | string): void {
    if (value) {
      this.value = value instanceof Date
        ? value
        : moment(value).toDate();
    } else {
      this.value = null;
    }
    this.tempValue = this.value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateChange = fn;
  }

  setCurrentTime(): void {
    const value = new Date();
    this.update(value);
  }

  onDateChange(date: Date): void {
    this.tempValue = this.dateTimeService.setDate(this.tempValue, date);
  }

  onTimeChange(time: Date): void {
    this.tempValue = this.dateTimeService.setTime(this.tempValue, time);
  }

  onOkClick(): void {
    this.update(this.tempValue);
  }

  private update(value: Date): void {
    this.value = value;
    this.tempValue = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};

}
