import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
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
  @Input() columns: Array<IGridColumn>;
  @Input() rows: Array<T>;
  @Input() valueGetter: (row: T) => string = () => null;

  private _value: string;
  private _isDisabled = false;

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
    this._value = this.valueGetter(row);
  }

  private propagateChange: Function = () => {};
}
