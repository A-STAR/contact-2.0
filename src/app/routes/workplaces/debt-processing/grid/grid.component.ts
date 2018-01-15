import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map, mergeMap } from 'rxjs/operators';

import { IDebt } from '../debt-processing.interface';
import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtProcessingService } from '../debt-processing.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-debt-processing-grid',
  templateUrl: './grid.component.html',
  styleUrls: [ './grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IDebt>;

  rows: IDebt[] = [];
  rowCount = 0;

  private gridKeys = {
    all: 'debtsprocessingall',
    callBack: 'debtsprocessingcallback',
    currentJob: 'debtsprocessingcurrentjob',
    visits: 'debtsprocessingvisits',
    promisePay: 'debtsprocessingpromisepay',
    partPay: 'debtsprocessingpartpay',
    problem: 'debtsprocessingproblem',
    returned: 'debtsprocessingreturn',
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private debtProcessingService: DebtProcessingService,
    private route: ActivatedRoute,
  ) {}

  get gridKey(): string {
    const { path } = this.route.snapshot.parent.url[0];
    return this.gridKeys[path];
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.debtProcessingService.fetch(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<IDebt>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(debt: IDebt): void {
    this.debtorCardService.openByDebtId(debt.debtId);
  }
}
