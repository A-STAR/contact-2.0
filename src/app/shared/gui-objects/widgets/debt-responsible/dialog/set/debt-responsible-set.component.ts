import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
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

  @Output() close = new EventEmitter<ICloseAction>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  onSelect(operator: IOperator): void {
    this.debtResponsibleService.setResponsible(this.debts, operator)
      .subscribe(result => {
        this.count = result.massInfo.total;
        this.successCount = result.massInfo.processed;
        this.setDialog('setResult');
        this.cdRef.markForCheck();
      });
  }

  onSetResult(): void {
    this.close.emit({ refresh: true });
  }

  onClose(): void {
    this.close.emit();
  }
}
