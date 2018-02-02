import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '../datetime.service';
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
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _value: Date;

  // TODO(d.maltsev): get format from locale
  format = 'DD.MM.YYYY HH:mm:ss';

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

  writeValue(value: Date | string): void {
    this._value = value instanceof Date
      ? value
      : moment(value).toDate();
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLInputElement;
    const delta = Math.sign(event.deltaY);
    const start = target.selectionStart;
    console.log(delta, start);
  }

  onTouch(): void {
    this.propagateTouch();
  }

  onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const date = moment(value, this.format);
    if (date.isValid()) {
      this.update(date.toDate());
    }
  }

  setCurrentTime(): void {
    const value = new Date();
    this.update(value);
    this.dropdown.close();
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
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
