import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordComponent implements ControlValueAccessor {
  isDisabled: boolean;

  private _value: string;
  private _isMasked = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  writeValue(value: string): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get value(): string {
    return this._value;
  }

  get type(): string {
    return this._isMasked ? 'password' : 'text';
  }

  get iconClass(): string {
    return this._isMasked ? 'fa fa-eye-slash' : 'fa fa-eye';
  }

  onChange(value: string): void {
    this._value = value;
    this.propagateChange(value);
  }

  toggle(): void {
    this._isMasked = !this._isMasked;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}
