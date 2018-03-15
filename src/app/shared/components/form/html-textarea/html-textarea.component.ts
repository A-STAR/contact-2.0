import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  get ngStyle(): Partial<CSSStyleDeclaration> {
    return {
      height: `${this.height}px`,
    };
  }

  get value(): string {
    return this._value;
  }

  writeValue(value: string): void {
    this._value = this.sanitizer.bypassSecurityTrustHtml(value) as string;
    this.cdRef.markForCheck();
  }

  registerOnChange(): void {
  }

  registerOnTouched(): void {
  }
}
