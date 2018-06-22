import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { defaultTo } from 'ramda';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
})
export class RangeComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Min and max values of model value (coords are always 0 - 100)
   */
  @Input() min = 10;
  @Input() max = 10000000;

  @Input() label: string;
  @Input() required = false;
  @Input() errors: any;
  @Input() debounce: number;
  @Input() showInput = false;
  @Input() logarithmic = false;
  /**
   * Formats decimal digits
   */
  @Input() precision = 0;

  @Input()
  set isReadonly(value: boolean) {
    this.readonly = this.setDefault(value, this.readonly);
    this.required = this.readonly ? false : this.required;
  }

  @Input()
  set isDisabled(value: boolean) {
    this.disabled = this.setDefault(value, this.disabled);
    this.required = this.disabled ? false : this.required;
  }

  disabled = false;
  readonly = false;
  minPosition = 0;
  maxPosition = 100;

  private _value: number;
  private _formattedValue: number;
  private debounce$ = new Subject<number>();
  private debounceSub: Subscription;

  constructor(private cdRef: ChangeDetectorRef) {}

  set value(val: number) {
    this._value = this.logarithmic ? this.toLogPosition(val) : val;
    this._formattedValue = val;
  }

  get value(): number {
    return this._value;
  }

  get formattedValue(): number {
    return this._formattedValue;
  }

  set formattedValue(val: number) {
    this._formattedValue = this.logarithmic ? this.fromLogPosition(val) : val;
  }

  ngOnInit(): void {
    if (this.debounce) {
      this.debounceSub = this.debounce$
        .debounceTime(this.debounce)
        .subscribe(value => this.update(value));
    }
  }

  ngOnDestroy(): void {
    if (this.debounceSub) {
      this.debounceSub.unsubscribe();
    }
  }

  writeValue(value: number): void {
    this.value = value || (this.maxPosition - this.minPosition) / 2;
    this.cdRef.markForCheck();
  }

  onChange(value: string): void {
    const valueAsNumber = value === '' ? null : Number(value);
    const newValue = isNaN(valueAsNumber) ? null : valueAsNumber;

    this.debounce ? this.debounce$.next(newValue) : this.update(newValue);
  }

  onInputChange(value: string): void {
    const valueAsNumber = Number(value);
    if (!isNaN(valueAsNumber)) {
      this.writeValue(valueAsNumber);
    }
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_: Function): void {
    // this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  validate(): any {
    switch (true) {
      case this.required && this.value == null:
        return { required: true };
      default:
        return null;
    }
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return defaultTo(defaultValue)(value);
  }

  private update(value: number): void {
    this.formattedValue = value;
    this.propagateChange(this.formattedValue);
    this.cdRef.markForCheck();
  }

  private fromLogPosition(pos: number): number {
    // The result should be between min and max value
    const minv = Math.log(this.min);
    const maxv = Math.log(this.max);

    // calculate adjustment factor
    const scale = (maxv - minv) / (this.maxPosition - this.minPosition);

    return Number(Math.exp(minv + scale * (pos - this.minPosition)).toFixed(this.precision));
  }

  private toLogPosition(value: number): number {
    const minv = Math.log(this.min);
    const maxv = Math.log(this.max);

    const scale = (maxv - minv) / (this.maxPosition - this.minPosition);

    return (Math.log(value) - minv) / scale + this.minPosition;
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
