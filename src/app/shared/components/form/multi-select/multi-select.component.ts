import { Component, Input, OnInit, OnDestroy, forwardRef, ViewChild, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IMultiselectItem } from './multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';

import { GridComponent } from '../../grid/grid.component';

@Component({
  selector: 'app-multi-select',
  styleUrls: ['./multi-select.component.scss'],
  templateUrl: './multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
})
export class MultiSelectComponent implements OnDestroy, OnInit, AfterViewInit, ControlValueAccessor {

  styles: CSSStyleDeclaration = {} as CSSStyleDeclaration;
  gridStyles: CSSStyleDeclaration = {} as CSSStyleDeclaration;

  @Input() height: number;
  @Input() columnsFrom: IGridColumn[];
  @Input() columnsTo: IGridColumn[];
  @Input() columnsTranslationKeyFrom: string;
  @Input() columnsTranslationKeyTo: string;
  @Input() rowsFrom;

  @ViewChild('gridFrom') gridFrom: GridComponent;
  @ViewChild('gridTo') gridTo: GridComponent;

  private _rowDoubleSelectFromSubscription;
  private _rowDoubleSelectToSubscription;
  private _active: IMultiselectItem[];
  private onChange: Function = () => {};
  private onTouched: Function = () => {};

  @Input()
  set active(items: Array<IMultiselectItem>) {
    this._active = items;
  }

  ngOnInit(): void {
    this.styles.height = this.gridStyles.height = this.gridStyles.minHeight = this.height + 'px';
  }

  ngAfterViewInit(): void {
    this._rowDoubleSelectFromSubscription = this.gridFrom.onRowDoubleSelect.subscribe(() => this.onRightAction());
    this._rowDoubleSelectToSubscription = this.gridTo.onRowDoubleSelect.subscribe(() => this.onLeftAction());
  }

  ngOnDestroy(): void {
    this._rowDoubleSelectFromSubscription.unsubscribe();
    this._rowDoubleSelectToSubscription.unsubscribe();
  }

  writeValue(value: any): void {
    this.active = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  onRightAction(): void {
    this.moveSelectedRecords(this.gridTo, this.gridFrom);
    this.clearSelections();
    this.updateActiveValue();
  }

  onRightDoubleAction(): void {
    this.moveAllRecords(this.gridTo, this.gridFrom);
    this.clearSelections();
    this.updateActiveValue();
  }

  onLeftAction(): void {
    this.moveSelectedRecords(this.gridFrom, this.gridTo);
    this.clearSelections();
    this.updateActiveValue();
  }

  onLeftDoubleAction(): void {
    this.moveAllRecords(this.gridFrom, this.gridTo);
    this.clearSelections();
    this.updateActiveValue();
  }

  private moveAllRecords(target, source) {
    target.rows = target.rows.concat(source.rows);
    source.rows = [];
  }

  private moveSelectedRecords(target, source) {
    target.rows = target.rows.concat(source.selected || []);
    source.rows = source.rows.filter((record: any) => source.selected.indexOf(record) === -1);
  }

  private clearSelections(): void {
    this.gridTo.selected = [];
    this.gridFrom.selected = [];
  }

  private updateActiveValue(): void {
    this.onChange(this.gridTo.rows);
  }
}
