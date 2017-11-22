import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IDialogMultiSelectValue, IDialogMultiSelectFilterType } from './dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';

import { GridFiltersService } from '../../../../core/filters/grid-filters.service';

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

  private value: IDialogMultiSelectValue[];

  private config = {
    users: {
      columnsFrom: [
        { prop: 'id' },
        // TODO(d.maltsev): should be fullName - API not implemented yet
        { prop: 'lastName' },
        { prop: 'organization' },
        { prop: 'position' },
      ],
      columnsTo: [
        // TODO(d.maltsev): should be fullName - API not implemented yet
        { prop: 'lastName' },
      ],
      fetch: this.gridFiltersService.fetchUsers(0),
      // TODO(d.maltsev): should be fullName - API not implemented yet
      labelGetter: row => row.lastName,
      valueGetter: row => row.id,
    },
  };

  isDisabled = false;
  rows: any[] = [];

  get columnsFrom(): IGridColumn[] {
    return this.config[this.filterType].columnsFrom;
  }

  get columnsTo(): IGridColumn[] {
    return this.config[this.filterType].columnsTo;
  }

  get fetch(): Observable<any> {
    return this.config[this.filterType].fetch;
  }

  get labelGetter(): (row: any) => string {
    return this.config[this.filterType].labelGetter;
  }

  get valueGetter(): (row: any) => IDialogMultiSelectValue {
    return this.config[this.filterType].valueGetter;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridFiltersService: GridFiltersService,
  ) {}

  ngOnInit(): void {
    this.fetch.subscribe(rows => {
      this.rows = rows;
      this.cdRef.markForCheck();
    });
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
