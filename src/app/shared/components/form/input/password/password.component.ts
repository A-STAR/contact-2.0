import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
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
  @Input() label: string;
  @Input() required: string;

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

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
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

  onFocusOut(): void {
    this.propagateTouch();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
