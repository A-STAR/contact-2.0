import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { range } from '@app/core/utils';
import { defaultTo } from 'ramda';
import { isNumber } from 'util';

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
  private static readonly ALLOWED_KEYS = {
    main: [
      ...range(0, 9).map(String),
      '.',
      '-',
    ],
    aux: [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ],
  };

  private static readonly MAX_LENGTH = 12;
  @Input() errors: any;
  @Input() label: string;
  @Input() min: number;
  @Input() max: number;
  @Input() positive = false;
  @Input() required = false;
  @Input() precision = 0;

  @Input()
  set isReadonly(value: boolean) {
    this.readonly = this.setDefault(value, this.readonly);
    this.required = this.readonly ? false : this.required;
  }

  @Input()
  set isDisabled(value: boolean) {
    this.disabled = this.setDefault(value, this.disabled);
    this.required = this.disabled ? false : this.required;
  }

  @Input() set step(step: number | string) {
    this._step = Number(step);
  }

  disabled = false;
  readonly = false;
  value: number;

  private _step = 1;

  private wheelListenter: () => void;

  constructor(
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  writeValue(value: number): void {
    this.value = this.precision && isNumber(value) ? Number(value.toFixed(this.precision)) : value;
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
      case this.required && this.value == null:
        return { required: true };
      case this.positive && isNumber(this.value) && this.value <= 0:
        return { positive: true };
      case !this.isMinValid(this.value):
        return { min: { minValue: this.min } };
      case !this.isMaxValid(this.value):
        return { max: { maxValue: this.max } };
      default:
        return null;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const { ctrlKey, key, target } = event;
    const { value } = target as HTMLInputElement;
    const { main, aux } = NumberComponent.ALLOWED_KEYS;
    if ((!main.includes(key) || value.length >= NumberComponent.MAX_LENGTH) && !aux.includes(key) && !ctrlKey) {
      event.preventDefault();
    }
  }

  onChange(value: string): void {
    const valueAsNumber = value === '' ? null : Number(value);
    const newValue = isNaN(valueAsNumber) ? null : valueAsNumber;
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
    if (!(this.disabled || this.readonly)) {
      event.preventDefault();
      const value = (this.value || 0) - this._step * Math.sign(event.deltaY);
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  onIncrementClick(): void {
    if (!(this.disabled || this.readonly)) {
      const value = (this.value || 0) + this._step;
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  onDecrementClick(): void {
    if (!(this.disabled || this.readonly)) {
      const value = (this.value || 0) - this._step;
      if (this.isMinValid(value) && this.isMaxValid(value)) {
        this.update(value);
      }
    }
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return defaultTo(defaultValue)(value);
  }

  private update(value: number): void {
    this.value = this.precision ? Number(value.toFixed(this.precision)) : value;
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
