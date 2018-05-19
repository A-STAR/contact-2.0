import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IDialogMultiSelectValue, IDialogMultiSelectFilterType } from './dialog-multi-select.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DialogMultiSelectService } from './dialog-multi-select.service';

import { DialogFunctions } from '@app/core/dialog';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { isEmpty } from '@app/core/utils';

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
export class DialogMultiSelectComponent<T> extends DialogFunctions implements ControlValueAccessor, OnInit {
  @Input() filterType: IDialogMultiSelectFilterType;
  @Input() filterParams: any = {};

  @Input() columnsFrom: ISimpleGridColumn<T>[] = [];
  @Input() columnsTo: ISimpleGridColumn<T>[] = [];
  @Input() rows: T[] = [];

  @Output() show = new EventEmitter<void>();

  @ViewChild('gridFrom') gridFrom: SimpleGridComponent<T>;
  @ViewChild('gridTo') gridTo: SimpleGridComponent<T>;

  dialog: string;
  isDisabled = false;

  private isInitialised = false;
  private _labelGetter: (row: T) => string;
  private previousValue: IDialogMultiSelectValue[];
  private _title: string;
  private value: IDialogMultiSelectValue[] = [];

  rowsFrom: T[] = [];
  rowsTo: T[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialogMultiSelectService: DialogMultiSelectService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.columnsFrom = this.dialogMultiSelectService.getColumnsFrom(this.filterType);
    this.columnsTo = this.dialogMultiSelectService.getColumnsTo(this.filterType);
  }

  get fetch(): (filterParams: any) => Observable<any> {
    return this.dialogMultiSelectService.getFetchCallback(this.filterType);
  }

  @Input('labelGetter')
  set labelGetter(fn: (row: T) => string) {
    this._labelGetter = fn;
  }

  get labelGetter(): (row: T) => string {
    return this._labelGetter || this.dialogMultiSelectService.getLabelGetter(this.filterType);
  }

  get valueGetter(): (row: T) => IDialogMultiSelectValue {
    return this.dialogMultiSelectService.getValueGetter(this.filterType);
  }

  @Input('title')
  set title(title: string) {
    this._title = title;
  }

  get title(): string {
    return this._title || this.dialogMultiSelectService.getTitle(this.filterType);
  }

  get selectionLength(): number {
    return this.value.length;
  }

  get displayValue(): string {
    return this.rows
      .filter(row => this.value.includes(this.valueGetter(row)))
      .map(this.labelGetter)
      .join(', ');
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

  onFromSelect(): void {
    this.cdRef.markForCheck();
  }

  onToSelect(): void {
    this.cdRef.markForCheck();
  }

  onFromDoubleClick(row: T): void {
    this.value = [
      ...this.value,
      this.valueGetter(row),
    ];
    this.gridFrom.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onToDoubleClick(row: T): void {
    this.value = this.value.filter(rowValue => rowValue !== this.valueGetter(row));
    this.gridTo.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onSelect(): void {
    this.value = [
      ...this.value,
      ...this.selectionFrom.map(this.valueGetter),
    ];
    this.gridFrom.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onSelectAll(): void {
    this.value = this.rows.map(this.valueGetter);
    this.gridFrom.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onUnselect(): void {
    this.value = this.value.filter(rowValue => !this.selectionTo.map(this.valueGetter).includes(rowValue));
    this.gridTo.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onUnselectAll(): void {
    this.value = [];
    this.gridTo.selection = [];
    this.updateValue();
    this.updateRows();
  }

  onSubmit(): void {
    this.previousValue = [...this.value];
    this.closeDialog();
  }

  onShowDialog(): void {
    if (this.isDisabled) {
      return;
    }

    this.setDialog('on');
    this.show.emit();

    if (!this.isInitialised) {
      this.isInitialised = true;
      this.fetch(this.filterParams).subscribe(rows => {
        this.rows = rows;
        this.updateRows();
        this.cdRef.markForCheck();
      });
    }
  }

  /**
   * @override
   */
  onCloseDialog(): void {
    this.writeValue(this.previousValue);
    this.updateValue();
    super.onCloseDialog();
  }

  writeValue(value?: IDialogMultiSelectValue[]): void {
    this.value = value || [];
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private propagateChange: Function = () => {};

  private updateRows(): void {
    this.rowsFrom = this.rows.filter(row => !this.containsRow(row));
    this.rowsTo = this.rows.filter(row => this.containsRow(row));
    this.cdRef.markForCheck();
  }

  private updateValue(): void {
    this.propagateChange(this.value);
    this.cdRef.markForCheck();
  }

  private get selectionFrom(): T[] {
    return this.gridFrom && this.gridFrom.selection || [];
  }

  private get selectionTo(): T[] {
    return this.gridTo && this.gridTo.selection || [];
  }

  private containsRow(row: T): boolean {
    return this.value.includes(this.valueGetter(row));
  }
}
