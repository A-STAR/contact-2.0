import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IVisitOperator } from '../visit-prepare.interface';

import { VisitPrepareService } from '../visit-prepare.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-visit-operator-grid',
  templateUrl: './visit-operator-grid.component.html',
  styleUrls: ['./visit-operator-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitOperatorGridComponent implements OnInit {

  operators: IVisitOperator[];

  private selectedOperator: IVisitOperator;

  columns: ISimpleGridColumn<IVisitOperator>[] = [
    { prop: 'id' },
    { prop: 'fullName' },
    { prop: 'organization' },
    { prop: 'position' }
  ].map(addGridLabel('widgets.visit.grid'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private visitPrepareService: VisitPrepareService
  ) { }

  ngOnInit(): void {
    this.visitPrepareService
      .fetchOperators()
      .subscribe(operators => {
        this.operators = operators;
        this.cdRef.markForCheck();
      });
  }

  onSelect(operators: IVisitOperator[]): void {

    this.selectedOperator = operators[0];
    this.visitPrepareService.dispatchAction(
      VisitPrepareService.MESSAGE_OPERATOR_SELECTED,
      this.selectedOperator
    );

  }
}
