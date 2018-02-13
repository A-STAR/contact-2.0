import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
  ],
  selector: 'app-number',
  styleUrls: [ './number.component.scss' ],
  templateUrl: './number.component.html'
})
export class NumberComponent implements ControlValueAccessor, Validator {
  @Input() min: number;
  @Input() max: number;

  @Input() set step(step: number | string) {
    this._step = Number(step);
  }

  disabled = false;
  value: number;

  private _step = 1;

  private wheelListenter: () => void;

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  writeValue(value: number): void {
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

  validate(c: any): any {
    switch (true) {
      case !this.isMinValid(this.value):
        return { min: { maxValue: this.max } };
      case !this.isMaxValid(this.value):
        return { max: { minValue: this.max } };
      default:
        return null;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    if ((key < '0' || key > '9') && key !== '.' && key !== 'Backspace' && key !== 'Delete' && key !== '-') {
      event.preventDefault();
    }
  }

  onChange(value: string): void {
    const newValue = Number(value) || null;
    this.update(newValue);
  }

  onFocus(): void {
    this.wheelListenter = this.renderer.listen(this.elRef.nativeElement, 'wheel', event => this.onWheel(event));
  }

  onFocusOut(): void {
    this.wheelListenter();
    this.propagateTouch();
  }

  onWheel(event: WheelEvent): void {
    if (!this.disabled) {
      event.preventDefault();
      const value = (this.value || 0) - this._step * Math.sign(event.deltaY);
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  onIncrementClick(): void {
    if (!this.disabled) {
      const value = (this.value || 0) + this._step;
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  onDecrementClick(): void {
    if (!this.disabled) {
      const value = (this.value || 0) - this._step;
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  private update(value: number): void {
    this.value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private isMinValid(value: number): boolean {
    return this.value == null || this.min == null || value >= this.min;
  }

  private isMaxValid(value: number): boolean {
    return this.value == null || this.max == null || value <= this.max;
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}