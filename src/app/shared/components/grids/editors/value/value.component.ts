import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { ILookupKey } from '@app/core/lookup/lookup.interface';
import { IValueEditorParams } from '@app/shared/components/grids/grids.interface';

import { TYPE_CODES } from '@app/core/utils';

@Component({
  selector: 'app-grid-value-edit',
  templateUrl: './value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueEditorComponent implements ICellEditorAngularComp {

  type: TYPE_CODES;
  value: any;
  dictCode: number;
  lookupKey: ILookupKey;
  private params: IValueEditorParams;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  refresh(): boolean {
    return false;
  }

  agInit(params: IValueEditorParams): void {

    const { node, valueTypeKey, dictCode, lookupKey, value } = params;

    this.params = params;
    this.value = value;

    this.dictCode = typeof dictCode === 'function' ? dictCode(node.data) : dictCode;
    this.lookupKey = lookupKey;

    this.type = node.data[valueTypeKey] || TYPE_CODES.STRING;

    this.cdRef.markForCheck();
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return [
      TYPE_CODES.DATE,
      TYPE_CODES.DATETIME,
      TYPE_CODES.DICT,
    ].includes(this.type);
  }

  onValueChange(value: any): void {
    this.value = value;
    if (value && this.type === TYPE_CODES.DATETIME) {
      this.params.stopEditing();
    }
  }
}
