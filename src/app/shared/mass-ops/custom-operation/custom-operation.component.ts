import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  readonly canSubmit$ = this.layout.canSubmit();

  constructor(
    private customOperationService: CustomOperationService
  ) { }

  onSubmit(): void {
    this.customOperationService
      .run(this.actionData.operation, this.actionData.payload, this.layout.data)
      .subscribe(() => {
        this.close.emit();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
