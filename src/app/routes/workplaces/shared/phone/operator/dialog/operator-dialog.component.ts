import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IOperator } from '../../operator/operator.interface';

import { OperatorService } from '../operator.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-phone-operator-dialog',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<number>();

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 50 },
    { prop: 'fullName' },
    { prop: 'debtCnt', width: 100 },
    { prop: 'organization' },
    { prop: 'position' }
  ];

  gridStyles = { height: '500px' };
  operators: Array<IOperator> = [];

  private selectedOperator: IOperator;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  get hasSelection(): boolean {
    return this.grid && !!this.grid.selected.length;
  }

  onSubmit(): void {
    this.select.emit(this.selectedOperator.id);
  }

  onClose(): void {
    this.close.emit();
  }

  private fetch(searchParams: object = {}): void {
    this.operatorService.fetchAll().subscribe(operators => {
      this.operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
