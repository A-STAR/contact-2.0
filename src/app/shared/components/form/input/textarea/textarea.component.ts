import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
})
export class TextareaComponent implements ControlValueAccessor, Validator {
  @Input() label: string;
  @Input() required = false;
  @Input() resizable = true;
  @Input() rows = 2;

  disabled = false;
  value: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get style(): Partial<CSSStyleDeclaration> {
    return this.resizable ? {} : { resize: 'none' };
  }

  writeValue(value: string): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  validate(): any {
    switch (true) {
      case this.value == null && this.required:
        return { required: true };
      default:
        return null;
    }
  }

  onChange(value: string): void {
    this.value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
