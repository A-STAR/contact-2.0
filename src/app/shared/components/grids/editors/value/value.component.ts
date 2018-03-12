import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams, ICellEditorParams } from 'ag-grid/main';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { TYPE_CODES } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-value-edit',
  templateUrl: './value.component.html',
})
export class ValueEditorComponent implements ICellEditorAngularComp {
  private params: ICellEditorParams;

  value: any;

  refresh(): boolean {
    return false;
  }

  get type(): number {
    const { data, valueTypeKey } = this.params as any;
    return data[valueTypeKey];
  }

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return [TYPE_CODES.DATE, TYPE_CODES.DATETIME, TYPE_CODES.DICT].includes(this.type);
  }

  onValueChange(value: any): void {
    this.value = value;
    this.params.api.stopEditing();
  }
}
