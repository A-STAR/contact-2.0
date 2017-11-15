import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { IOperator } from '../../../operator/operator.interface';

import { DebtResponsibleService } from '../../debt-responsible.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-debt-responsible-set',
  templateUrl: './debt-responsible-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetComponent extends DialogFunctions {

  @Input() debts: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(this.debts, operator)
      .subscribe(() => this.close.emit(true));
  }

  onSetResult(): void {
    this.close.emit(true);
  }

  onClose(): void {
    this.close.emit(false);
  }
}
