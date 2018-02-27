import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IVisitOperator } from '../visit-prepare.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { VisitPrepareService } from '../visit-prepare.service';

@Component({
  selector: 'app-visit-operator-grid',
  templateUrl: './visit-operator-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitOperatorGridComponent implements OnInit {

  private _operators: Array<IVisitOperator> = [];

  private selectedOperator$ = new BehaviorSubject<IVisitOperator>(null);

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'fullName' },
    { prop: 'organization' },
    { prop: 'position' }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private visitPrepareService: VisitPrepareService,
    private gridService: GridService,
  ) { }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.fetch();

    this.selectedOperator$.subscribe(operator =>
      this.visitPrepareService.dispatchAction(VisitPrepareService.MESSAGE_OPERATOR_SELECTED, operator)
    );
  }

  get operators(): Array<IVisitOperator> {
    return this._operators;
  }

  get selectedOperator(): IVisitOperator {
    return (this._operators || [])
      .find(operator => this.selectedOperator$.value && operator.id === this.selectedOperator$.value.id);
  }

  onSelect(operator: IVisitOperator): void {
    this.selectedOperator$.next(operator);
  }

  private fetch(): void {
    this.visitPrepareService.fetchOperators().subscribe(operators => {
      this._operators = operators;
      this.cdRef.markForCheck();
    });
  }
}
