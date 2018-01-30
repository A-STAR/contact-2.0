import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

type IModifier = 'h' | 'm' | 's';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true,
    },
  ],
  selector: 'app-time',
  styleUrls: [ './time.component.scss' ],
  templateUrl: './time.component.html'
})
export class TimeComponent implements ControlValueAccessor {
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get value(): Date {
    return this._value;
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

  getFormattedValue(modifier: IModifier, delta: number): string {
    const format = { h: 'HH', m: 'mm', s: 'ss' }[modifier] || '';
    return moment(this._value).clone().add(delta, modifier).format(format);
  }

  onUp(modifier: IModifier): void {
    this.update(1, modifier);
  }

  onDown(modifier: IModifier): void {
    this.update(-1, modifier);
  }

  onWheel(modifier: IModifier, event: WheelEvent): void {
    const delta = -Math.sign(event.deltaY);
    this.update(delta, modifier);
  }

  private update(delta: number, modifier: IModifier): void {
    this._value = moment(this._value).clone().add(delta, modifier).toDate();
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
