import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IOperationResult } from '../../debt-responsible.interface';

import { DebtResponsibleService } from '../../debt-responsible.service';

@Component({
  selector: 'app-debt-responsible-clear',
  templateUrl: './debt-responsible-clear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleClearComponent {

  @Input() debts: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) { }

  onConfirm(): void {
    this.debtResponsibleService.clearResponsible(this.debts)
      .subscribe(result => this.onOperationResult(result));
  }

  onOperationResult(result: IOperationResult): void {
    this.debtResponsibleService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
