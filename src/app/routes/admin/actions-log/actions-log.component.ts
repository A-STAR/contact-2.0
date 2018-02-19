import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ViewChild, AfterViewInit
} from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';

import { IActionLog } from './actions-log.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ActionsLogService } from '@app/routes/admin/actions-log/actions-log.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements AfterViewInit {
  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IActionLog>;

  rows: IActionLog[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  data: any;
  // titlebar: ITitlebar = {
  //   title: 'actionsLog.title',
  //   items: [
  //     {
  //       type: TitlebarItemTypeEnum.BUTTON_SEARCH,
  //       enabled: of(true),
  //       action: () => this.onRequest(),
  //     },
  //     {
  //       type: TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL,
  //       enabled: of(true),
  //       action: () => this.doExport(),
  //     },
  //   ],
  // };

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
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
      const filterForm = this.grid.getFiltersForm();
      if (filterForm) {
        filterForm.patchValue(filterData);
        this.cdRef.markForCheck();
      }
    }
  }

  private doExport(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    const columns = this.grid.getExportableColumns();
    if (columns) {
      const request = this.gridService.buildRequest(params, filters);
      // NOTE: no paging in export, so remove it from the request
      const { paging, ...rest } = request;
      const body = { columns, ...rest };
      this.downloader.download(body);
    }
  }
}
