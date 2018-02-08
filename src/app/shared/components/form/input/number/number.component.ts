import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Renderer2 } from '@angular/core';
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
  templateUrl: 'number.component.html'
})
export class NumberComponent implements ControlValueAccessor {
  disabled = false;
  value: number;
  wheelStep = 1;

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
    event.preventDefault();
    const value = (this.value || 0) - this.wheelStep * Math.sign(event.deltaY);
    this.update(value);
  }

  private update(value: number): void {
    this.value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
