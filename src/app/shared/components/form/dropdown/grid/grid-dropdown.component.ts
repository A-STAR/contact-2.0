import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IGridColumn } from '../../../grid/grid.interface';

@Component({
  selector: 'app-grid-dropdown',
  templateUrl: './grid-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GridDropdownComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDropdownComponent<T> implements ControlValueAccessor {
  private _value: string;
  private _isDisabled = false;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { prop: 'name', minWidth: 150, maxWidth: 350 },
    { prop: 'value', minWidth: 100, maxWidth: 150, localized: true },
    { prop: 'dsc', minWidth: 200 },
  ];

  rows: Array<T> = [];

  get value(): string {
    return this._value;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  onDoubleClick(row: T): void {
    console.log('click!', row);
  }

  private propagateChange: Function = () => {};
}
