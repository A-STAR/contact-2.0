import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, ViewChild, EventEmitter, Output
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IActionLog } from './actions-log.interface';
import { IContextMenuItem } from '../../../shared/components/grid/grid.interface';

import { IAGridResponse, IAGridSelected } from '../../../shared/components/grid2/grid2.interface';
import { IQuery } from '../../../shared/components/qbuilder2/qbuilder2.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

import { ActionsLogService } from './actions-log.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';
import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { DownloaderComponent } from '../../../shared/components/downloader/downloader.component';
import { MetadataGridComponent } from '../../../shared/components/metadata-grid/metadata-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-actions-log',
  styleUrls: ['./actions-log.component.scss'],
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements  OnDestroy, AfterViewInit {
  @Output() onSelect = new EventEmitter<IAGridSelected>();

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;
  actions = 'contactLogContact';

  query$ = new BehaviorSubject<IQuery>(null);

  rows: IActionLog[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  contextMenuOptions: IContextMenuItem[] = [
    {
      action: 'openDebtCardByDebtor',
      label: 'default.grid.actions.openDebtCardByDebtor',
      enabled: of(true),
      params: [ 'personId' ],
    }
  ];

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // filter
    this.hasViewPermission$ = this.userPermissionsService.has('ACTION_LOG_VIEW');
  }

  get queryBuilderOpen$(): Observable<boolean> {
    return this.query$.map(query => query !== null);
  }

  ngAfterViewInit(): void {
    this.permissionSub = this.hasViewPermission$
      .subscribe(canView => {
        if (!canView) {
          this.rows = [];
          this.rowCount = 0;
          this.notificationsService.permissionError().entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          // load data
          if ((this.grid && this.grid.grid as any).gridOptions) {
            this.onRequest();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  onRequest(): void {
    const filters = this.getCombinedFilters();
    const params = (<any>this.grid.grid).grid.getRequestParams();

    this.actionsLogService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  doExport(): void {
    const filters = this.getCombinedFilters();
    const grid = (<any>this.grid.grid);
    const params = grid.grid.getRequestParams();

    if (grid) {
      const columns = grid.grid.getExportableColumns();
      const request = grid.grid.buildRequest(params, filters);
      // NOTE: we got to remove the paging from the request
      const { paging, ...rest } = request;
      const body = { columns, ...rest };
      this.downloader.download(body);
    }
  }

  openQueryBuilder(): void {
    this.query$.next({
      filters: this.getCombinedFilters(),
      columns: [].concat(this.grid.columns)
    });
  }

  closeQueryBuilder(): void {
    this.query$.next(null);
  }

  private getCombinedFilters(): FilterObject {
    const filters = this.filter.getFilters();
    return filters.addFilter((this.grid.grid as MetadataGridComponent<any>).getFilters());
  }
}
