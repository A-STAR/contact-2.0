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

  get rows$(): Observable<Array<IDebt>> {
    return this.debtProcessingService.debts$;
  }

  get rowCount$(): Observable<number> {
    return this.debtProcessingService.debts$.map(debts => debts.length);
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.debtProcessingService.fetch(filters, params);
  }

  onSelect(action: IAGridEventPayload): void {
    // this.dispatch(action);
  }

  onDblClick({ debtId }: IDebt): void {
    const { innerHeight: height, innerWidth: width} = window;
    const winConfig = `menubar=no,location=no,resizable=yes,scrollbars=yes,modal=yes,status=no,height=${height},width=${width}`;
    const win = window.open(`${this.router.url}/${debtId}`, '_blank', winConfig);
    if (win.focus) { win.focus() };
  }

  getRowNodeId(debt: IDebt): number {
    return debt.debtId;
  }

}
