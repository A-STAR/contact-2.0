import { Component } from '@angular/core';
import { ICellEditorParams } from 'ag-grid/main';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { TYPE_CODES } from '@app/core/utils';

@Component({
  selector: 'app-grid-value-edit',
  templateUrl: './value.component.html',
})
export class ValueEditorComponent implements ICellEditorAngularComp {
  private params: ICellEditorParams;

  value: any;
  dictCode: number;

  refresh(): boolean {
    return false;
  }

  get type(): number {
    const { node, valueTypeKey } = this.params as any;
    return node.data[valueTypeKey] || TYPE_CODES.STRING;
  }

  agInit(params: ICellEditorParams): void {
    const { node, dictCode, value } = params as any;
    this.params = params;
    this.value = value;
    this.dictCode = typeof dictCode === 'function' ? dictCode(node.data) : dictCode;
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return true;
  }

  onValueChange(value: any): void {
    this.value = value;
  }
}
