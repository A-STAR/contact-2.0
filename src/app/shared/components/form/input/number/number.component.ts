import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    }
  ],
  selector: 'app-number',
  styleUrls: [ './number.component.scss' ],
  templateUrl: './number.component.html'
})
export class NumberComponent implements ControlValueAccessor {
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

  onChange(value: number): void {
    this.update(value);
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
      this.update(value);
    }
  }

  onIncrementClick(): void {
    if (!this.disabled) {
      const value = (this.value || 0) + this._step;
      this.update(value);
    }
  }

  onDecrementClick(): void {
    if (!this.disabled) {
      const value = (this.value || 0) - this._step;
      this.update(value);
    }
  }

  private update(value: number): void {
    this.value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
