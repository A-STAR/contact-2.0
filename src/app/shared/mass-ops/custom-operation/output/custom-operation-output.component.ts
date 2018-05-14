import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ICustomActionData } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-custom-operation-output',
  templateUrl: './custom-operation-output.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationOutputComponent {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() config: IDynamicLayoutConfig;
  @Input() result: ICustomActionData;

  @Output() close = new EventEmitter<ICloseAction>();

  onClose(): void {
    this.close.emit();
  }
}
