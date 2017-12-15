import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { IOperator } from '../../operator/operator.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { OperatorService } from '../operator.service';

import { GridComponent } from '../../../../components/grid/grid.component';

@Component({
  selector: 'app-operator-grid',
  templateUrl: './operator-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorGridComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 50 },
    { prop: 'fullName' },
    { prop: 'debtCnt', width: 100 },
    { prop: 'organization' },
    { prop: 'position' }
  ];

  gridStyles = { height: '500px' };
  operators: Array<IOperator> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService,
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(operator: IOperator): void {
    this.operatorService.dispatchAction(OperatorService.MESSAGE_OPERATOR_SELECTED, { type: 'select', payload: operator });
  }

  onDblClick(operator: IOperator): void {
    this.operatorService.dispatchAction(OperatorService.MESSAGE_OPERATOR_SELECTED, { type: 'dblclick', payload: operator });
  }

  private fetch(searchParams: object = {}): void {
    this.operatorService.fetchAll().subscribe(operators => {
      this.operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
