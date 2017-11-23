import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IDialogMultiSelectValue } from './dialog-multi-select.interface';

import { GridComponent } from '../../grid/grid.component';

import { DialogFunctions } from '../../../../core/dialog';

import { isEmpty } from '../../../../core/utils';

@Component({
  selector: 'app-dialog-multi-select',
  templateUrl: './dialog-multi-select.component.html',
  styleUrls: [ './dialog-multi-select.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogMultiSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogMultiSelectComponent<T> extends DialogFunctions implements ControlValueAccessor {
  @Input() columnsFrom = [];
  @Input() columnsTo = [];
  @Input() rows: T[] = [];

  @ViewChild('gridFrom') gridFrom: GridComponent;
  @ViewChild('gridTo') gridTo: GridComponent;

  dialog: string;

  private isDisabled = false;
  private value: IDialogMultiSelectValue[];

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  @Input() labelGetter: (row: T) => string = () => null;
  @Input() valueGetter: (row: T) => IDialogMultiSelectValue = () => null;

  get selectionLength(): number {
    return this.value.length;
  }

  get displayValue(): string {
    return this.rows
      .filter(row => this.value.includes(this.valueGetter(row)))
      .map(this.labelGetter)
      .join(', ');
  }

  get rowsFrom(): T[] {
    return this.rows.filter(row => !this.containsRow(row));
  }

  get rowsTo(): T[] {
    return this.rows.filter(row => this.containsRow(row));
  }

  get isSelectIconDisabled(): boolean {
    return isEmpty(this.selectionFrom);
  }

  get isSelectAllIconDisabled(): boolean {
    return isEmpty(this.rowsFrom);
  }

  get isUnselectIconDisabled(): boolean {
    return isEmpty(this.selectionTo);
  }

  get isUnselectAllIconDisabled(): boolean {
    return isEmpty(this.rowsTo);
  }

  onFromDoubleClick(row: T): void {
    this.value = [
      ...this.value,
      this.valueGetter(row),
    ];
    this.updateValue();
  }

  onToDoubleClick(row: T): void {
    this.value = this.value.filter(rowValue => rowValue !== this.valueGetter(row));
    this.updateValue();
  }

  onSelect(): void {
    this.value = [
      ...this.value,
      ...this.selectionFrom.map(this.valueGetter),
    ];
    this.updateValue();
  }

  onSelectAll(): void {
    this.value = this.rows.map(this.valueGetter);
    this.updateValue();
  }

  onUnselect(): void {
    this.value = this.value.filter(rowValue => !this.selectionTo.map(this.valueGetter).includes(rowValue));
    this.updateValue();
  }

  onUnselectAll(): void {
    this.value = [];
    this.updateValue();
  }

  onSubmit(): void {
    this.closeDialog();
  }

  onShowDialog(): void {
    this.setDialog('on');
  }

  writeValue(value: IDialogMultiSelectValue[]): void {
    this.value = value || [];
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private propagateChange: Function = () => {};

  private updateValue(): void {
    this.propagateChange(this.value);
    this.cdRef.markForCheck();
  }

  private get selectionFrom(): T[] {
    return this.gridFrom && this.gridFrom.selected || [];
  }

  private get selectionTo(): T[] {
    return this.gridTo && this.gridTo.selected || [];
  }

  private containsRow(row: T): boolean {
    return this.value.includes(this.valueGetter(row));
  }
}
