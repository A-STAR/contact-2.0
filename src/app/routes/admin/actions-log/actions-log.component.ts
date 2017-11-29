import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IEmployee, IActionLog } from './actions-log.interface';

import { IAGridResponse } from '../../../shared/components/grid2/grid2.interface';
import { IUserTerm } from '../../../core/user/dictionaries/user-dictionaries.interface';
import { IQuery } from '../../../shared/components/qbuilder2/qbuilder2.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

import { ActionsLogService } from './actions-log.service';

import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { DownloaderComponent } from '../../../shared/components/downloader/downloader.component';
import { MetadataGridComponent } from '../../../shared/components/metadata-grid/metadata-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-actions-log',
  styleUrls: ['./actions-log.component.scss'],
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements AfterViewInit, OnDestroy {
  static COMPONENT_NAME = 'ActionsLogComponent';

  // filter
  actionTypesRows: Observable<IUserTerm[]>;
  employeesRows: Observable<IEmployee[]>;
  // grid
  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;

  query$ = new BehaviorSubject<IQuery>(null);

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(MetadataGridComponent) grid: MetadataGridComponent<any>;

  rows: IActionLog[] = [];
  rowCount = 0;

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // filter
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.employeesRows = this.actionsLogService.employeesRows;
    // grid
    this.hasViewPermission$ = this.userPermissionsService.has('ACTION_LOG_VIEW');
  }

  get queryBuilderOpen$(): Observable<boolean> {
    return this.query$.map(query => query !== null);
  }

  ngAfterViewInit(): void {
    this.permissionSub = this.hasViewPermission$
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.rows = [];
          this.rowCount = 0;
          this.notificationsService.error('errors.default.read.403').entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          this.actionsLogService.getEmployeesAndActionTypes()
            .pipe(first())
            .subscribe();
          // load data
          if (this.grid.grid.gridOptions.api) {
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
    const params = this.grid.getRequestParams();
    this.actionsLogService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  doExport(): void {
    const filters = this.getCombinedFilters();
    const params = this.grid.getRequestParams();
    const request = this.grid.grid.buildRequest(params, filters);
    const columns = this.grid.grid.getExportableColumns();
    const body = { columns, ...request };

    this.downloader.download(body);
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
    return filters.addFilter(this.grid.getFilters());
  }

}
