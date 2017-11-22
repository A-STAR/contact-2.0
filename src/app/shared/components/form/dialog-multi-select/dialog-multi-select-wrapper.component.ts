import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GridFiltersService } from '../../../../core/filters/grid-filters.service';

type IValue = string | number;

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
export class DialogMultiSelectWrapperComponent<T> implements ControlValueAccessor, OnInit {
  @Input() filterType: 'dictionaries' | 'entityGroups' | 'portfolios' |  'users';

  private value: IValue[];

  private config = {
    users: {
      columnsFrom: [
        { prop: 'id' },
        { prop: 'lastName' },
        { prop: 'organization' },
        { prop: 'position' },
      ],
      columnsTo: [
        { prop: 'lastName' },
      ],
      fetch: this.gridFiltersService.fetchUsers(0),
      labelGetter: row => row.lastName,
      valueGetter: row => row.id,
    },
  };

  isDisabled = false;
  rows: any[] = [];

  get columnsFrom(): any[] {
    return this.filterType
      ? this.config[this.filterType].columnsFrom
      : [];
  }

  get columnsTo(): any[] {
    return this.filterType
      ? this.config[this.filterType].columnsTo
      : [];
  }

  get fetch(): any {
    return this.filterType
      ? this.config[this.filterType].fetch
      : null;
  }

  get labelGetter(): any[] {
    return this.filterType
      ? this.config[this.filterType].labelGetter
      : [];
  }

  get valueGetter(): any[] {
    return this.filterType
      ? this.config[this.filterType].valueGetter
      : [];
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

  writeValue(value: IValue[]): void {
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

  onChange(value: IValue[]): void {
    this.value = value;
    this.propagateChange(value);
  }

  private propagateChange: Function = () => {};
}
