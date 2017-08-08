import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDebt } from '../debt.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-debt-grid',
  templateUrl: './debt-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGridComponent {
  get canDisplayGrid(): boolean {
    return true;
  }

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'creditTypeCode' },
    { prop: 'creditName' },
    { prop: 'contract' },
    { prop: 'statusCode' },
    { prop: 'creditStartDate' },
    { prop: 'currencyId' },
    { prop: 'debtSum' },
    { prop: 'totalSum' },
    { prop: 'dpd' },
    { prop: 'portfolio' },
    { prop: 'bank' },
    { prop: 'debtReasonCode' },
  ];

  debts: Array<IDebt> = [];

  onDoubleClick(debt: IDebt): void {

  }

  onSelect(debt: IDebt): void {

  }
}
