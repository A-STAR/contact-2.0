import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IAGridEventPayload } from '../../../shared/components/grid2/grid2.interface';
import { IDebt } from './debt-processing.interface';

import { DebtProcessingService } from './debt-processing.service';

import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  styleUrls: [ './debt-processing.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  @ViewChild(Grid2Component) grid: Grid2Component;

  constructor(
    private debtProcessingService: DebtProcessingService,
    private router: Router,
  ) {}

  get currentPage$(): Observable<number> {
    return this.debtProcessingService.currentPage$;
  }

  get pageSize$(): Observable<number> {
    return this.debtProcessingService.pageSize$;
  }

  get rows$(): Observable<Array<IDebt>> {
    return this.debtProcessingService.debts$;
  }

  get rowCount$(): Observable<number> {
    return this.debtProcessingService.debts$.map(debts => debts.length);
  }

  get selected$(): Observable<Array<IDebt>> {
    return this.debtProcessingService.selected$;
  }

  onRequestData(action: IAGridEventPayload): void {
    this.dispatch(action);
    this.debtProcessingService.fetch(this.getFilter());
  }

  onFilter(gridFilters: any): void {
    this.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.debtProcessingService.filter(this.getFilter());
  }

  onSelect(action: IAGridEventPayload): void {
    this.dispatch(action);
  }

  onDblClick([id]: Array<number>): void {
    this.router.navigate([ `/workplaces/debts/${id}` ]);
  }

  getRowNodeId(debt: IDebt): number {
    return debt.debtId;
  }

  private dispatch(action: Action): void {
    this.debtProcessingService.dispatch(action.type, action.payload);
  }

  private getFilter(): FilterObject {
    return this.grid.getFilters();
  }
}
