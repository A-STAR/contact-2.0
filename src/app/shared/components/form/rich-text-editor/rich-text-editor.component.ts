import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextEditorComponent implements ControlValueAccessor {
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
    console.log(value);
    this._value = value;
    this.propagateChange(value);
  }

  private propagateChange: Function = () => {};
}
