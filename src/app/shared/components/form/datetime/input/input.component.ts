import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { DateTimeService } from '../datetime.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    }
  ],
  selector: 'app-datetime-input',
  templateUrl: './input.component.html'
})
export class DateTimeInputComponent implements ControlValueAccessor {
  // TODO(d.maltsev): get format from locale
  @Input() format: string;

  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dateTimeService: DateTimeService,
  ) {}

  get mask(): any {
    return this.dateTimeService.getMaskParamsFromMomentFormat(this.format);
  }

  get momentValue(): moment.Moment {
    return moment(this._value);
  }

  writeValue(value: Date): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onBlur(): void {
    this.propagateTouch();
  }

  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLInputElement;
    const delta = Math.sign(event.deltaY);
    const start = target.selectionStart;
    console.log(delta, start);
  }

  onChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const date = moment(value, this.format);
    if (date.isValid()) {
      this.update(date.toDate());
    }
  }

  private update(value: Date): void {
    this._value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
