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
  private _options: IMultiTextOption[] = [];
  private _selection: number[] = [];
  private _selectedId: number;
  private _values: IMultiTextValue[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input('options')
  set options(options: IMultiTextOption[]) {
    this._options = options;
    if (this._options.length > 0) {
      this._selectedId = this._options[0].value;
    }
    this.cdRef.markForCheck();
  }

  get options(): IMultiTextOption[] {
    return this._options;
  }

  get selection(): any {
    return this._options;
  }

  ngOnInit(): void {
    this._selectedId = this.options.length > 0 ? this.options[0].value : null;
    this.cdRef.markForCheck();
  }

  writeValue(values: IMultiTextValue[]): void {
    this._selection = (values || []).map(v => v.languageId);
    this._values = values || [];
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get displayValue(): string {
    const item = (this._values || []).find(v => v.languageId === this._selectedId);
    return item && item.value;
  }

  onSelectedValueChange(value: IMultiTextOptionSelection[]): void {
    this._selection = value.filter(v => !v.removed).map(v => v.value);
    this._selectedId = value.find(v => v.selected).value;
    this.propagateChange(this._value);
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    const item = (this._values || []).find(v => v.languageId === this._selectedId);
    if (item) {
      item.value = value;
    } else {
      this._values.push({ languageId: this._selectedId, value });
    }
    this.propagateChange(this._value);
  }

  private get _value(): any {
    return this._selection.reduce((acc, v) => {
      const item = (this._values || []).find(val => val.languageId === v);
      return item ? { ...acc, [v]: item.value } : acc;
    }, {});
  }

  private propagateChange: Function = () => {};
}