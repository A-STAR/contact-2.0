import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { ICustomActionData } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { IMetadataActionParam } from '@app/core/metadata/metadata.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-custom-operation-output',
  templateUrl: './custom-operation-output.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationOutputComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() key: string;
  @Input() outputParams: IMetadataActionParam[];
  @Input() result: ICustomActionData;

  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig;

  constructor(
    private customOperationService: CustomOperationService
  ) {}

  ngOnInit(): void {
    this.config = this.customOperationService
      .getActionParamsConfig(this.key, this.outputParams, false);
  }

  onClose(): void {
    this.close.emit();
  }
}
