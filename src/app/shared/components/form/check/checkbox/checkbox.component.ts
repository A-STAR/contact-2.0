import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    }
  ],
  selector: 'app-checkbox',
  styleUrls: [ './checkbox.component.scss' ],
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string;

  private _disabled: boolean;
  private _value = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get disabled(): boolean {
    return this._disabled;
  }

  get checked(): boolean {
    return this._value;
  }

  writeValue(value: boolean): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // No need in touch callback for checkbox
    // because a click will change its value and mark control as dirty anyway
  }

  setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
    this.cdRef.markForCheck();
  }

  onChange(): void {
    this._value = !this._value;
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}
