import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperator } from './debt-responsible-set.interface';
import { IOperationResult } from '../debt-responsible.interface';

import { DebtResponsibleService } from '../debt-responsible.service';

@Component({
  selector: 'app-debt-responsible-set',
  templateUrl: './debt-responsible-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetComponent {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) { }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(this.actionData.payload, operator)
      .subscribe(result => this.onOperationResult(result));
  }

  onOperationResult(result: IOperationResult): void {
    this.debtResponsibleService.showOperationNotification(result);
    // this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
    this.close.emit({ refresh: false });
  }

  onClose(): void {
    this.close.emit();
  }
}
