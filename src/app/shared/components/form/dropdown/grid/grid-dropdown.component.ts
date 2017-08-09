import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IGridColumn } from '../../../grid/grid.interface';

import { DropdownComponent } from '../../../dropdown/dropdown.component';

@Component({
  selector: 'app-grid-dropdown',
  templateUrl: './grid-dropdown.component.html',
  styleUrls: [ './grid-dropdown.component.scss' ],
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
  @Input() controlClass = 'form-control';
  @Input() rows: Array<T>;
  @Input() valueGetter: (row: T) => string = () => null;

  @Output() select = new EventEmitter<T>();

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

  onSelect(row: T): void {
    this.setValue(row);
  }

  onClearClick(): void {
    this.setValue(null);
  }

  private setValue(row: T): void {
    const newValue = row ? this.valueGetter(row) : null;
    this._value = newValue;
    this.propagateChange(newValue);
    this.dropdown.close();
    this.select.emit(row);
  }

  private propagateChange: Function = () => {};
}
