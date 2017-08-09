import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IGridColumn } from '../../../grid/grid.interface';

import { DropdownComponent } from '../../../dropdown/dropdown.component';

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

  @ViewChild('dropdown') dropdown: DropdownComponent;

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
    const newValue = this.valueGetter(row);
    this._value = newValue;
    this.propagateChange(newValue);
    this.dropdown.close();
  }

  private propagateChange: Function = () => {};
}
