import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ViewChild, AfterViewInit
} from '@angular/core';
import * as moment from 'moment';

import { IActionLog } from './actions-log.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { ActionsLogService } from '@app/routes/admin/actions-log/actions-log.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements AfterViewInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IActionLog>;

  rows: IActionLog[] = [];
  rowCount = 0;
  rowIdKey = 'id';
  filterData: any;

  data: any;

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.setInitialDates();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();

    this.actionsLogService
      .fetch(filters, params)
      .subscribe((response: IAGridResponse<IActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  private setInitialDates(): void {
    if (this.grid) {
      // pass the new value to the control
      const filterData = {
        startDate: moment()
          .startOf('month')
          .toDate(),
        endDate: moment()
          .endOf('month')
          .toDate(),
      };
      this.filterData = filterData;
    }
  }
}
