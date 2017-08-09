import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-grid-dropdown',
  templateUrl: './grid-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GridDropdownComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDropdownComponent implements ControlValueAccessor {
  private _value: string;
  private _isDisabled = false;

  get value(): string {
    return this._value;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  private propagateChange: Function = () => {};
}
