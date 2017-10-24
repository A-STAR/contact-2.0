import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IRadioGroupOption } from './radio-group.interface';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() options: Array<IRadioGroupOption>;

  private _value: string;

  constructor(private cdRef: ChangeDetectorRef) {}

  writeValue(value: string): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get value(): string {
    return this._value;
  }

  onChange(value: string): void {
    this._value = value;
    this.propagateChange(value);
  }

  private propagateChange: Function = () => {};
}
