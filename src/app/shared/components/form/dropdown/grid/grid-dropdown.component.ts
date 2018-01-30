import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, forwardRef, Input, Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IGridColumn } from '../../../grid/grid.interface';

import { DropdownDirective } from '../../../dropdown/dropdown.directive';

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
  @Input() translationKey: string;

  @Output() select = new EventEmitter<T>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _selection: T;
  private _isDisabled = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() labelGetter: (row: T) => string = () => null;
  @Input() valueGetter: (row: T) => string = () => null;

  get label(): string {
    return this._selection ? this.labelGetter(this._selection) : null;
  }

  get value(): string {
    return this._selection ? this.valueGetter(this._selection) : null;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  get selection(): Array<T> {
    return [ this._selection ];
  }

  writeValue(value: string): void {
    this._selection = (this.rows || []).find(row => this.valueGetter(row) === value);
    this.cdRef.markForCheck();
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
    this.setRow(row);
  }

  onClearClick(): void {
    this.setRow(null);
  }

  private setRow(row: T): void {
    this._selection = row;
    this.propagateChange(this.value);
    this.dropdown.close();
    this.select.emit(row);
  }

  private propagateChange: Function = () => {};
}
