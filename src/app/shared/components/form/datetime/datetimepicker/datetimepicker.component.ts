import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '../datetime.service';

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
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  private _value: Date;

  // TODO(d.maltsev): get format from locale
  format = 'MM/DD/YYYY HH:mm:SS';

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  get momentValue(): moment.Moment {
    return moment(this._value);
  }

  get value(): Date {
    return this._value;
  }

  get mask(): any {
    return this.dateTimeService.getMaskParamsFromMomentFormat(this.format);
  }

  writeValue(value: Date): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // this.propagateTouch = fn;
  }

  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLInputElement;
    const delta = Math.sign(event.deltaY);
    const start = target.selectionStart;
    console.log(delta, start);
  }

  setCurrentTime(): void {
    const value = new Date();
    this.update(value);
  }

  onDateChange(date: Date): void {
    const value = this.dateTimeService.setDate(this._value, date);
    this.update(value);
  }

  onTimeChange(time: Date): void {
    const value = this.dateTimeService.setTime(this._value, time);
    this.update(value);
  }

  private update(value: Date): void {
    this._value = value;
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
