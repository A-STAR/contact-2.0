import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-html-textarea',
  templateUrl: './html-textarea.component.html',
  styleUrls: [ './html-textarea.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlTextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlTextareaComponent implements ControlValueAccessor {
  @Input() height = 100;

  private _value: string;

  constructor(private cdRef: ChangeDetectorRef) {}

  get ngStyle(): Partial<CSSStyleDeclaration> {
    return {
      height: `${this.height}px`,
    };
  }

  get value(): string {
    return this._value;
  }

  writeValue(value: string): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
  }

  registerOnTouched(fn: Function): void {
  }
}
