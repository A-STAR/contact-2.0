import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IOperator } from '../debt-responsible-set.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DebtResponsibleSetService } from '../debt-responsible-set.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-debt-responsible-set-grid',
  templateUrl: './debt-responsible-set-grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetGridComponent implements OnInit {

  columns: ISimpleGridColumn<IOperator>[] = [
    { prop: 'id', width: 50 },
    { prop: 'fullName' },
    { prop: 'debtCnt', width: 100 },
    { prop: 'organization' },
    { prop: 'position' }
  ].map(addGridLabel('widgets.operator.grid'));

  operators: Array<IOperator> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtResponsibleSetService: DebtResponsibleSetService,
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(operators: IOperator[]): void {
    this.debtResponsibleSetService.dispatchAction(DebtResponsibleSetService.MESSAGE_OPERATOR_SELECTED,
      {
        type: 'select', payload: operators[0]
      }
    );
  }

  onDblClick(operator: IOperator): void {
    this.debtResponsibleSetService.dispatchAction(DebtResponsibleSetService.MESSAGE_OPERATOR_SELECTED,
      {
        type: 'dblclick', payload: operator
      }
    );
  }

  private fetch(): void {
    this.debtResponsibleSetService.fetchAll().subscribe(operators => {
      this.operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
