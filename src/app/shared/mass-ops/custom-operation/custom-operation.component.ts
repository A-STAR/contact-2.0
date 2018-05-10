import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ICustomOperationGridAction } from './custom-operation.interface';


@Component({
  selector: 'app-mass-custom-operation',
  templateUrl: './custom-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationComponent {

  @Input() actionData: ICustomOperationGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }
}
