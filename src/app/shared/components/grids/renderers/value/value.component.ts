import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { TYPE_CODES } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-tick-renderer',
  templateUrl: './value.component.html',
})
export class ValueRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  type: TYPE_CODES;
  value: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    const { data, valueTypeKey } = this.params as any;
    this.type = data[valueTypeKey];
    this.value = this.type ? this.valueConverterService.deserialize(this.params.data).value
      : (this.type = TYPE_CODES.STRING) && this.params.value;

    this.cdRef.markForCheck();
  }

  refresh(): boolean {
    return false;
  }
}
