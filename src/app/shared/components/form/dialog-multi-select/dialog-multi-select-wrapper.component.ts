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

  isDisabled = false;
  rows: any[] = [];

  columnsFrom = [
    { prop: 'id' },
    { prop: 'lastName' },
    { prop: 'organization' },
    { prop: 'position' },
  ];

  columnsTo = [
    { prop: 'lastName' },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridFiltersService: GridFiltersService,
  ) {}

  ngOnInit(): void {
    this.gridFiltersService.fetchUsers(0).subscribe(users => {
      this.rows = users;
      this.cdRef.markForCheck();
    });
  }

  labelGetter = row => row.lastName;
  valueGetter = row => row.id;

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
