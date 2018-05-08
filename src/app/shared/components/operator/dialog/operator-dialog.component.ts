import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IOperator } from '../../operator/operator.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { OperatorService } from '../operator.service';
import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  selector: 'app-phone-operator-dialog',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent implements OnInit {
  @Output() close = new EventEmitter<null>();
  @Output() onSelect = new EventEmitter<number>();

  columns: ISimpleGridColumn<IOperator>[] = [
    { prop: 'id', width: 50 },
    { prop: 'fullName' },
    { prop: 'debtCnt', width: 100 },
    { prop: 'organization' },
    { prop: 'position' }
  ].map(addGridLabel('widgets.operator.grid'));

  operators: IOperator[] = [];
  selection: IOperator;

  private selectedOperator: IOperator;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  onSelectRow(operators: IOperator[]): void {
    this.selection = isEmpty(operators)
      ? null
      : operators[0];
  }

  onSubmit(): void {
    this.onSelect.emit(this.selectedOperator.id);
  }

  onClose(): void {
    this.close.emit();
  }

  private fetch(): void {
    this.operatorService.fetchAll().subscribe(operators => {
      this.operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
