import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '@app/shared/components/form/datetime/datetime.service';
import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  selector: 'app-timepicker',
  styleUrls: [ './timepicker.component.scss' ],
  templateUrl: './timepicker.component.html'
})
export class TimePickerComponent implements ControlValueAccessor, Validator {
  @Input() label: string;
  @Input() minTime: Date;
  @Input() maxTime: Date;
  @Input() required = false;

  @Input() set displaySeconds(displaySeconds: boolean) {
    this._displaySeconds = displaySeconds === undefined ? true : displaySeconds;
    this.timeFormat = this._displaySeconds ? 'HH:mm:ss' : 'HH:mm';
  }

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  disabled = false;

  timeFormat = 'HH:mm:ss';

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
        : moment(value, this.timeFormat).toDate();
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
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  validate(): any {
    const value = moment(this.value, this.timeFormat);
    switch (true) {
      case this.value && this.minTime && value.isBefore(this.minTime):
        return { min: { minValue: moment(this.minTime).format(this.timeFormat) } };
      case this.value && this.maxTime && value.isAfter(this.maxTime):
        return { max: { maxValue: moment(this.maxTime).format(this.timeFormat) } };
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

  onOkClick(): void {
    const value = this.tempValue || moment().set({ h: 0, m: 0, s: 0, ms: 0 }).toDate();
    this.update(value);
    this.dropdown.close();
  }

  setCurrentTime(): void {
    const value = new Date();
    this.update(value);
    this.dropdown.close();
  }

  onTimeChange(time: Date): void {
    this.tempValue = this.dateTimeService.setTime(this.tempValue, time);
    this.cdRef.markForCheck();
  }

  private update(value: Date): void {
    this.value = value;
    this.tempValue = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
