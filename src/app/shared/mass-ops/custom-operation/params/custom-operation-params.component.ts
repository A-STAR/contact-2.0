import { ChangeDetectionStrategy, Component, Input, ViewChild, OnInit } from '@angular/core';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-custom-operation-params',
  templateUrl: './custom-operation-params.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationParamsComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() key: string;
  @Input() inputParams: ICustomOperationParams[];

  config: IDynamicLayoutConfig;

  constructor(
    private customOperationService: CustomOperationService
  ) {}

  ngOnInit(): void {
    this.config = this.customOperationService.getActionInputParamsConfig(this.key, this.inputParams);
  }
}
