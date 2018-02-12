import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '@app/shared/components/form/datetime/datetime.service';
import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    }
  ],
  selector: 'app-datetimepicker',
  styleUrls: [ './datetimepicker.component.scss' ],
  templateUrl: './datetimepicker.component.html'
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  @Input() set displaySeconds(displaySeconds: boolean) {
    this._displaySeconds = displaySeconds === undefined ? true : displaySeconds;
    this.dateTimeFormat = this._displaySeconds ? 'L HH:mm:ss' : 'L HH:mm';
  }

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  disabled = false;

  dateTimeFormat = 'L HH:mm:ss';

  value: Date;
  tempValue: Date;

  private _displaySeconds: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  ngOnInit(): void {
    if (this.minDateTime) {
      // TODO(d.topheenko): this is horrible, but nothing else seems to work
      setTimeout(() => this.update(this.minDateTime), 0);
    }
  }

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
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
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
    this.tempValue = this.dateTimeService.setDate(this.tempValue, date);
  }

  onTimeChange(time: Date): void {
    this.tempValue = this.dateTimeService.setTime(this.tempValue, time);
  }

  onOkClick(): void {
    this.update(this.tempValue);
    this.dropdown.close();
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
