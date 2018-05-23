import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';

import { ICustomActionData, ICustomOperationParams } from './custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent implements OnInit {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  result: ICustomActionData;

  inputParams: ICustomOperationParams[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService
  ) { }

  ngOnInit(): void {
    this.customOperationService.getOperationParams(this.actionData)
      .subscribe(params => {
        this.inputParams = params;
        this.cdRef.markForCheck();
      });
  }

  get inputParamsExists(): boolean {
    return this.inputParams && !!this.inputParams.length;
  }

  onSubmit(data: ICustomActionData): void {
    this.customOperationService
      .run(this.actionData, data)
      .subscribe(result => {
        if (this.actionData.outputConfig) {
          this.result = result.data;
        } else {
          this.customOperationService.showResultMessage(result.data[0]);
          this.close.emit();
        }
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
