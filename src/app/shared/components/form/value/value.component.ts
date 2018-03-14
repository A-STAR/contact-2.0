import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { IValue } from '../../../../core/utils/value';

@Component({
  selector: 'app-value-input',
  templateUrl: './value.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueInputComponent implements ControlValueAccessor {
  private _value: IValue;

  constructor(
    private cdRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  // For some reason getter doesn't work
  date = null;

  writeValue(value: IValue): void {
    this._value = value;
    if (value && value.valueD) {
      this.date = this.valueConverterService.fromISO(value.valueD);
    }
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  get value(): IValue {
    return this._value;
  }

  onNumberChange(value: number): void {
    this._value.valueN = Array.isArray(value) ? value[0].value : value;
    this.propagateChange(this._value);
  }

  onStringChange(value: string): void {
    this._value.valueS = value;
    this.propagateChange(this._value);
  }

  onBooleanChange(value: number): void {
    this._value.valueB = value;
    this.propagateChange(this._value);
  }

  onDateChange(date: Date): void {
    this.date = date;
    this._value.valueD = this.valueConverterService.toISO(date);
    this.propagateChange(this._value);
  }

  private propagateChange: Function = () => {};
}
