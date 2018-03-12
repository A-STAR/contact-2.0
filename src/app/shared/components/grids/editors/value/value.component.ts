import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellEditorParams } from 'ag-grid/main';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    const { data, valueTypeKey } = this.params as any;
    return data[valueTypeKey];
  }

  agInit(params: any): void {
    const { data, dictCode, value } = params as any;
    this.params = params;
    this.value = value;
    this.dictCode = typeof dictCode === 'function' ? dictCode(data) : dictCode;
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return true;
  }

  onValueChange(value: any): void {
    this.value = value;
    this.params.api.stopEditing();
  }
}
