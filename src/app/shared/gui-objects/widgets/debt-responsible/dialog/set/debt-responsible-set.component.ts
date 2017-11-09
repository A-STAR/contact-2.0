import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { IOperator } from '../../../operator/operator.interface';

import { DebtResponsibleService } from '../../debt-responsible.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-debt-responsible-set',
  templateUrl: './debt-responsible-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetComponent extends DialogFunctions {

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(operator)
      .subscribe(() => this.setDialog('setResult'));
  }

  onSetResult(): void {
    this.close.emit(true);
  }

  onClose(): void {
    this.close.emit(false);
  }
}
