import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { IOperator } from '../../../operator/operator.interface';

import { DebtResponsibleService } from '../../debt-responsible.service';

@Component({
  selector: 'app-debt-responsible-set',
  templateUrl: './debt-responsible-set.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetComponent {

  @Output() close = new EventEmitter<boolean>();

  constructor(
    private debtResponsibleService: DebtResponsibleService
  ) { }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(operator)
      .subscribe(() => this.close.emit(true));
  }

  onClose(): void {
    this.close.emit(false);
  }
}
