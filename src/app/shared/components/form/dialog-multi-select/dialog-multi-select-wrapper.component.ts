import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IDialogMultiSelectValue, IDialogMultiSelectFilterType } from './dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';

import { DialogMultiSelectWrapperService } from './dialog-multi-select-wrapper.service';
import { GridService } from '../../grid/grid.service';

@Component({
  selector: 'app-dialog-multi-select-wrapper',
  templateUrl: './dialog-multi-select-wrapper.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogMultiSelectWrapperComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogMultiSelectWrapperComponent implements ControlValueAccessor, OnInit {
  @Input() filterType: IDialogMultiSelectFilterType;
  @Input() filterParams: any = {};

  columnsFrom: IGridColumn[] = [];
  columnsTo: IGridColumn[] = [];
  isDisabled = false;
  rows: any[] = [];
  value: IDialogMultiSelectValue[];

  private isInitialized = false;

  get columnsFromTranslationKey(): string {
    return this.dialogMultiSelectWrapperService.getColumnsFromTranslationKey(this.filterType);
  }

  get columnsToTranslationKey(): string {
    return this.dialogMultiSelectWrapperService.getColumnsToTranslationKey(this.filterType);
  }

  get fetch(): (filterParams: any) => Observable<any> {
    return this.dialogMultiSelectWrapperService.getFetchCallback(this.filterType);
  }

  get labelGetter(): (row: any) => string {
    return this.dialogMultiSelectWrapperService.getLabelGetter(this.filterType);
  }

  get title(): string {
    return this.dialogMultiSelectWrapperService.getTitle(this.filterType);
  }

  get valueGetter(): (row: any) => IDialogMultiSelectValue {
    return this.dialogMultiSelectWrapperService.getValueGetter(this.filterType);
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialogMultiSelectWrapperService: DialogMultiSelectWrapperService,
    private gridService: GridService,
  ) {}

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

  onShowDialog(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.fetch(this.filterParams).subscribe(rows => {
        this.rows = rows;
        this.cdRef.markForCheck();
      });
    }
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

  onChange(value: IDialogMultiSelectValue[]): void {
    this.value = value;
    this.propagateChange(value);
  }

  private propagateChange: Function = () => {};
}
