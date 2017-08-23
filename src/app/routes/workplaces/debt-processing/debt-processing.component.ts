import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IDebt } from './debt-processing.interface';

import { DebtProcessingService } from './debt-processing.service';

import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

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
    return this.debtProcessingService.state$.map(debts => debts.data);
  }

  get rowCount$(): Observable<number> {
    return this.debtProcessingService.state$.map(debts => debts.total);
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.debtProcessingService.fetch(filters, params);
  }

  onDblClick({ personId }: IDebt): void {
    this.router.navigate([ `${this.router.url}/${personId}` ]);
    // const { innerHeight: height, innerWidth: width} = window;
    // const winConfig = `menubar=no,location=no,resizable=yes,scrollbars=yes,modal=yes,status=no,height=${height},width=${width}`;
    // const win = window.open(`${this.router.url}/${debtId}`, '_blank', winConfig);
    // if (win.focus) { win.focus() };
  }

  getRowNodeId(debt: IDebt): number {
    return debt.debtId;
  }

}
