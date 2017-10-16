import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { isEmpty } from '../../../../../core/utils';

type IMultiSelectValue = Array<number|string>;

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: [ './multi-select.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() nullable = false;
  @Input() options: IOption[] = [];

  private _isDisabled = false;
  private _value: IMultiSelectValue = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  get label(): string {
    if (isEmpty(this._value)) {
      return null;
    }
    if (this._value.length > 1) {
      return `Выбрано элементов: ${this._value.length}`;
    }
    const option = this.options.find(o => o.value === this._value[0]);
    return option ? option.label : null;
  }

  getId = (option: IOption) => option.value;
  getName = (option: IOption) => option.label;

  onSelect(item: IOption): void {
    this._value = this.containsValue(item.value)
      ? this._value.filter(v => v !== item.value)
      : [ ...this._value, item.value ];
    this.propagateChange(this._value);
  }

  writeValue(value: IMultiSelectValue): void {
    this.value = value || [];
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  private set value(value: IMultiSelectValue) {
    this._value = value;
    this.cdRef.markForCheck();
  }

  private containsValue(value: number|string): boolean {
    return (this._value || []).includes(value);
  }

  private propagateChange: Function = () => {};
}
