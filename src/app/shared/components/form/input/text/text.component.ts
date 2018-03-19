import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef,
  Input, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, /* NG_VALIDATORS, */ NG_VALUE_ACCESSOR /*, Validator */ } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => TextComponent),
    //   multi: true,
    // },
  ],
  selector: 'app-text',
  templateUrl: 'text.component.html'
})
export class TextComponent implements ControlValueAccessor, /* Validator, */ AfterViewInit {
  @ViewChild('input') inputEl: ElementRef;

  @Input() errors: any;
  @Input() label: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() required = false;
  @Input() autofocus = false;

  disabled = false;
  value: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.inputEl.nativeElement.focus();
    }
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

  // validate(): any {
  //   switch (true) {
  //     case this.value == null && this.required:
  //       return { required: true };
  //     case this.minLength && this.value && this.value.length < this.minLength:
  //       return { min: { minLength: this.minLength } };
  //     case this.maxLength && this.value && this.value.length > this.maxLength:
  //       return { max: { maxLength: this.maxLength } };
  //     default:
  //       return null;
  //   }
  // }

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
