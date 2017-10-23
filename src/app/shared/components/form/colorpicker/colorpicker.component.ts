import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-colorpicker-input',
  templateUrl: './colorpicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements ControlValueAccessor {
  private _value: string;

  options = [
    { value: '',     label: 'default.colors.transparent' },
    { value: '#dff', label: 'default.colors.azure' },
    { value: '#edf', label: 'default.colors.violet' },
    { value: '#eed', label: 'default.colors.olive' },
    { value: '#efd', label: 'default.colors.lime' },
    { value: '#fde', label: 'default.colors.fuchsia' },
    { value: '#fed', label: 'default.colors.orange' },
    { value: '#fef', label: 'default.colors.pink' },
    { value: '#ffd', label: 'default.colors.yellow' },
  ];

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

  onChange(event: any): void {
    this._value = event[0].value;
    this.propagateChange(this._value);
  }

  renderer = (label, item) => {
    return `<span style="background: ${item.value}; display: inline-block; width: 10px; height: 10px;"></span> ${label}`;
  }

  get value(): string {
    return this._value;
  }

  private propagateChange: Function = () => {};
}
