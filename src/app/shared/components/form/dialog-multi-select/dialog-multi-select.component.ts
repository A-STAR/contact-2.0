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
import { first } from 'rxjs/operators';

import { IDialogMultiSelectValue, IDialogMultiSelectFilterType } from './dialog-multi-select.interface';

import { DialogMultiSelectService } from './dialog-multi-select.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { GridComponent } from '../../grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';

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
export class DialogMultiSelectComponent<T> extends DialogFunctions
  implements ControlValueAccessor, OnInit {
  @Input() filterType: IDialogMultiSelectFilterType;
  @Input() filterParams: any = {};

  @Input() columnsFrom = [];
  @Input() columnsTo = [];
  @Input() rows: T[] = [];

  @Output() show = new EventEmitter<void>();

  @ViewChild('gridFrom') gridFrom: GridComponent;
  @ViewChild('gridTo') gridTo: GridComponent;

  dialog: string;
  isDisabled = false;

  private _columnsToTranslationKey: string;
  private _columnsFromTranslationKey: string;
  private isInitialised = false;
  private _labelGetter: (row: T) => string;
  private _valueGetter: (row: T) => IDialogMultiSelectValue;
  private previousValue: IDialogMultiSelectValue[];
  private _title: string;
  private value: IDialogMultiSelectValue[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialogMultiSelectWrapperService: DialogMultiSelectService,
    private gridService: GridService,
  ) {
    super();
  }

  ngOnInit(): void {
    const columnsFrom = this.dialogMultiSelectWrapperService.getColumnsFrom(this.filterType);
    const columnsTo = this.dialogMultiSelectWrapperService.getColumnsTo(this.filterType);
    this.gridService.setDictionaryRenderers([ ...columnsFrom, ...columnsTo ])
      .pipe(first())
      .subscribe(columns => {
        this.columnsFrom = this.gridService.setRenderers(columnsFrom);
        this.columnsTo = this.gridService.setRenderers(columnsTo);
      });
  }

  @Input('columnsToTranslationKey')
  set columnsToTranslationKey(translationKey: string) {
    this._columnsToTranslationKey = translationKey;
  }

  get columnsToTranslationKey(): string {
    return this._columnsToTranslationKey || this.dialogMultiSelectWrapperService.getColumnsToTranslationKey(this.filterType);
  }

  @Input('columnsFromTranslationKey')
  set columnsFromTranslationKey(translationKey: string) {
    this._columnsFromTranslationKey = translationKey;
  }

  get columnsFromTranslationKey(): string {
    return this._columnsFromTranslationKey || this.dialogMultiSelectWrapperService.getColumnsFromTranslationKey(this.filterType);
  }

  get fetch(): (filterParams: any) => Observable<any> {
    return this.dialogMultiSelectWrapperService.getFetchCallback(this.filterType);
  }

  @Input('labelGetter')
  set labelGetter(fn: (row: T) => string) {
    this._labelGetter = fn;
  }

  get labelGetter(): (row: T) => string {
    return this._labelGetter || this.dialogMultiSelectWrapperService.getLabelGetter(this.filterType);
  }

  @Input('valueGetter')
  set valueGetter(fn: (row: T) => IDialogMultiSelectValue) {
    this._valueGetter = fn;
  }

  get valueGetter(): (row: T) => IDialogMultiSelectValue {
    return this.dialogMultiSelectWrapperService.getValueGetter(this.filterType);
  }

  @Input('title')
  set title(title: string) {
    this._title = title;
  }

  get title(): string {
    return this._title || this.dialogMultiSelectWrapperService.getTitle(this.filterType);
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
    this.gridFrom.clearSelection();
    this.updateValue();
  }

  onToDoubleClick(row: T): void {
    this.value = this.value.filter(rowValue => rowValue !== this.valueGetter(row));
    this.gridTo.clearSelection();
    this.updateValue();
  }

  onSelect(): void {
    this.value = [
      ...this.value,
      ...this.selectionFrom.map(this.valueGetter),
    ];
    this.gridFrom.clearSelection();
    this.updateValue();
  }

  onSelectAll(): void {
    this.value = this.rows.map(this.valueGetter);
    this.gridFrom.clearSelection();
    this.updateValue();
  }

  onUnselect(): void {
    this.value = this.value.filter(rowValue => !this.selectionTo.map(this.valueGetter).includes(rowValue));
    this.gridTo.clearSelection();
    this.updateValue();
  }

  onUnselectAll(): void {
    this.value = [];
    this.gridTo.clearSelection();
    this.updateValue();
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
