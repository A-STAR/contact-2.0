import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TickComponent),
      multi: true,
    }
  ],
  selector: 'app-tick',
  styleUrls: ['./tick.component.scss'],
  template: `
  <div class="tick-wrapper">
    <i *ngIf="value" class="tick-icon icon co-checkbox-mark"></i>
    <span class="tick-label" (click)="onChange()"> {{ label | translate }}</span>
  </div>
  `
})
export class TickComponent implements ControlValueAccessor {
  @Input() label: string;

  private _disabled: boolean;
  value = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get disabled(): boolean {
    return this._disabled;
  }

  writeValue(value: boolean): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    // No need in touch callback for checkbox
    // because a click will change its value and mark control as dirty anyway
  }

  setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
    this.cdRef.markForCheck();
  }

  onChange(): void {
    this.value = !this.value;
    this.propagateChange(this.value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}
