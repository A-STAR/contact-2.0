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

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  onSelect(rows: T[]): void {
    if (!isEmpty(rows)) {
      const [ row ] = rows;
      this.setRow(row);
    }
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
