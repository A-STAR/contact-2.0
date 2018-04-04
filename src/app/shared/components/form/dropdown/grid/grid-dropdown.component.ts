import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, forwardRef, Input, Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';
import { isEmpty } from '@app/core/utils';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridDropdownComponent<T> implements ControlValueAccessor {
  @Input() columns: ISimpleGridColumn<T>[];
  @Input() controlClass = 'form-control';
  @Input() label: string;
  @Input() required: boolean;

  @Input() rows: Array<T>;

  @Input()
  set controlDisabled(value: boolean) {
    this.setDisabledState(value);
  }

  @Output() select = new EventEmitter<T>();

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _selection: T;
  private _isDisabled = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  @Input() labelGetter: ((row: T) => string) | string = () => null;
  @Input() valueGetter: ((row: T) => string) | string = () => null;

  get vLabel(): string {
    const { _selection, labelGetter } = this;
    return _selection
      ? typeof labelGetter === 'function' ? labelGetter(_selection) : _selection[labelGetter]
      : null;
  }

  get value(): string {
    const { _selection, valueGetter } = this;
    return _selection
      ? typeof valueGetter === 'function' ? valueGetter(_selection) : _selection[valueGetter]
      : null;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  get selection(): Array<T> {
    return [ this._selection ];
  }

  writeValue(value: string): void {
    const { valueGetter } = this;
    this._selection = (this.rows || []).find(row => {
      const rowValue = typeof valueGetter === 'function' ? valueGetter(row) : row[valueGetter];
      return rowValue === value;
    });
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  onSelect(rows: T[]): void {
    if (!isEmpty(rows)) {
      const [ row ] = rows;
      this.setRow(row, this.dropdown.opened);
    }
  }

  onClearClick(): void {
    this.setRow(null);
  }

  private setRow(row: T, propagateChange: boolean = true): void {
    this._selection = row;
    if (propagateChange) {
      this.propagateChange(this.value);
    }
    this.dropdown.close();
    this.select.emit(row);
  }

  private propagateChange: Function = () => {};
}
