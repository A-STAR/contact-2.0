import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IOperator } from '../../../operator/operator.interface';
import { IOperationResult } from '../../debt-responsible.interface';

import { DebtResponsibleService } from '../../debt-responsible.service';

@Component({
  selector: 'app-debt-responsible-set',
  templateUrl: './debt-responsible-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetComponent {

  @Input() debts: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) { }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(this.debts, operator)
      .subscribe(result => this.onOperationResult(result));
  }

  onOperationResult(result: IOperationResult): void {
    this.debtResponsibleService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  onClose(): void {
    this.close.emit();
  }
}
