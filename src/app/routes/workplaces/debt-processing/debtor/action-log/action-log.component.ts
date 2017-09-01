import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { IDebtorActionLog } from './action-log.interface';
import { IAGridResponse } from '../../../../../shared/components/grid2/grid2.interface';

import { ActionLogService } from './action-log.service';

import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

@Component({
  selector: 'app-debtor-action-log',
  templateUrl: './action-log.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorActionLogComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';

  @ViewChild(Grid2Component) grid: Grid2Component;

  rows: IDebtorActionLog[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private actionLogService: ActionLogService,
    private router: Router,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.actionLogService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IDebtorActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick({ id }: IDebtorActionLog): void {
    this.router.navigate([ `${this.router.url}/${id}` ]);
  }

  getRowNodeId(actionLog: IDebtorActionLog): number {
    return actionLog.id;
  }

}
