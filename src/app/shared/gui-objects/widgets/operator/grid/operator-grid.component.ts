import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { IOperator } from '../../operator/operator.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { OperatorService } from '../operator.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

import { GridComponent } from '../../../../components/grid/grid.component';

@Component({
  selector: 'app-operator-grid',
  templateUrl: './operator-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorGridComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'fullName' },
    { prop: 'debtCnt' },
    { prop: 'organization' },
    { prop: 'position' }
  ];

  gridStyles = { height: '500px' };
  operators: Array<IOperator> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService,
    private messageBusService: MessageBusService,
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(operator: IOperator): void {
    this.messageBusService.dispatch(OperatorService.MESSAGE_OPERATOR_SELECTED, null, operator);
  }

  private fetch(searchParams: object = {}): void {
    this.operatorService.fetchAll().subscribe(operators => {
      this.operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
