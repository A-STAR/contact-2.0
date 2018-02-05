import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
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
  template: ''
})
export class CheckboxComponent {
  private _value: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  @HostBinding('class.checked')
  get value(): boolean {
    return this._value;
  }

  writeValue(value: boolean): void {
    this._value = null;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // No need in touch callback for checkbox
    // because a click will change its value and mark control as dirty anyway
  }

  @HostListener('click')
  onClick(): void {
    this._value = !this._value;
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}

