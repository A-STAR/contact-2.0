import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { TYPE_CODES, getRawValue } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-tick-renderer',
  templateUrl: './value.component.html',
})
export class ValueRendererComponent implements ICellRendererAngularComp {

  type: TYPE_CODES;
  value: any;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  agInit(params: ICellRendererParams & { valueTypeKey: string}): void {
    const { data, valueTypeKey } = params;
    this.type = data[valueTypeKey];
    this.value = this.type ? getRawValue(params.data, valueTypeKey)
      : (this.type = TYPE_CODES.STRING) && params.value;

    this.cdRef.markForCheck();
  }

  refresh(): boolean {
    return false;
  }
}
