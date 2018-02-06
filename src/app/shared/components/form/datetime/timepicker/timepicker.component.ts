import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
    }
  ],
  selector: 'app-timepicker',
  styleUrls: [ './timepicker.component.scss' ],
  templateUrl: './timepicker.component.html'
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() minTime: Date;
  @Input() maxTime: Date;
  @Input() set displaySeconds(displaySeconds: boolean) {
    this._displaySeconds = displaySeconds === undefined ? true : displaySeconds;
    this.timeFormat = this._displaySeconds ? 'HH:mm:ss' : 'HH:mm';
  }

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  timeFormat: string;
  private _displaySeconds: boolean;
  private _disabled = false;
  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  get displaySeconds(): boolean {
    return this._displaySeconds;
  }

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
        : moment(value, this.timeFormat).toDate();
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

  onTimeChange(time: Date): void {
    const value = this.dateTimeService.setTime(this._value, time);
    this.update(value);
  }

  private update(value: Date): void {
    this._value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
