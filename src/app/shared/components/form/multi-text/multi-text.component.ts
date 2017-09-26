import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IMultiTextOption, IMultiTextOptionSelection, IMultiTextValue } from './multi-text.interface';

@Component({
  selector: 'app-multitext-input',
  templateUrl: './multi-text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiTextComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiTextComponent implements ControlValueAccessor, OnInit {
  @Input() options: IMultiTextOption[] = [];

  private _selectedId: number;
  private _values: IMultiTextValue[];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._selectedId = this.options[0].value;
    this.cdRef.markForCheck();
  }

  writeValue(values: IMultiTextValue[]): void {
    this._values = values;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get displayValue(): string {
    return this.selectedSlice && this.selectedSlice.value;
  }

  onSelectedValueChange(value: IMultiTextOptionSelection[]): void {
    const presentValues = value.filter(v => !v.removed).map(v => v.value);
    this._values = this._values.filter(v => presentValues.includes(v.languageId));
    this._selectedId = value.find(v => v.selected).value;
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    if (!this._values) {
      this._values = [];
    }
    this.selectedSlice.value = value;
    this.propagateChange(value);
  }

  private get selectedSlice(): IMultiTextValue {
    return this._values && this._values.find(v => v.languageId === this._selectedId);
  }

  private propagateChange: Function = () => {};
}
