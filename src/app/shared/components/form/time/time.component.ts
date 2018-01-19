import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ],
})
export class TimeComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() value: string;

  mask = {
    mask: [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
    keepCharPositions: true
  };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // this.onTouched = fn;
  }

  onValueChange(value: string): void {
    this.onChange(value);
  }

  private onChange: Function = () => {};
  // private onTouched: Function = () => {};
}
