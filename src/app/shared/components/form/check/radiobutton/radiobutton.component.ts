import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    }
  ],
  selector: 'app-radiobutton',
  styleUrls: [ './radiobutton.component.scss' ],
  templateUrl: './radiobutton.component.html'
})
export class RadioButtonComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string;
  @Input() name: string;
  @Input() value: string;

  disabled: boolean;
  model: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.name && this.formControlName) {
      throw new Error('Radiobutton must have either "formControlName" of "name".');
    }
  }

  writeValue(model: string): void {
    this.model = model;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    // No need in touch callback for radiobutton
    // because a click will change its value and mark control as dirty anyway
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdRef.markForCheck();
  }

  onModelChange(model: string): void {
    this.model = model;
    this.propagateChange(model);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}
