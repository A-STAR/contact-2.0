import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { ICustomActionData } from './custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  result: ICustomActionData;

  constructor(
    private customOperationService: CustomOperationService
  ) { }

  onSubmit(data: ICustomActionData): void {
    this.customOperationService
      .run(this.actionData, this.actionData.payload, data)
      .subscribe(result => {
        if (result.data) {
          this.result = result.data;
        } else {
          this.close.emit();
        }
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
