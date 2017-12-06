import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, ViewChild, ViewEncapsulation, EventEmitter, Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IEmployee, IActionLog } from './actions-log.interface';
import { IContextMenuItem } from '../../../shared/components/grid/grid.interface';

import { IAGridResponse, IAGridSelected } from '../../../shared/components/grid2/grid2.interface';
import { IUserTerm } from '../../../core/user/dictionaries/user-dictionaries.interface';
import { IQuery } from '../../../shared/components/qbuilder2/qbuilder2.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

import { ActionsLogService } from './actions-log.service';

import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { DownloaderComponent } from '../../../shared/components/downloader/downloader.component';
import { ActionGridComponent } from '../../../shared/components/action-grid/action-grid.component';
import { MetadataGridComponent } from '../../../shared/components/metadata-grid/metadata-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-actions-log',
  styleUrls: ['./actions-log.component.scss'],
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements  OnDestroy, AfterViewInit {
  static COMPONENT_NAME = 'ActionsLogComponent';

  // filter
  actionTypesRows: Observable<IUserTerm[]>;
  employeesRows: Observable<IEmployee[]>;
  // grid
  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;
  actions = 'contactLogContact';

  query$ = new BehaviorSubject<IQuery>(null);
  @Output() onSelect = new EventEmitter<IAGridSelected>();

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  rows: IActionLog[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  contextMenuOptions: IContextMenuItem[] = [
    {
      action: 'openUserById',
      label: 'default.grid.actions.openUserById',
      enabled: Observable.of(true),
      params: [ 'userId' ],
    }
  ];

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
          if ((this.grid && this.grid.grid && this.grid.grid as MetadataGridComponent<any>).gridOptions) {
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
    const params = ((this.grid as ActionGridComponent<any>).grid as MetadataGridComponent<any>).grid.getRequestParams();

    this.actionsLogService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  doExport(): void {
    const filters = this.getCombinedFilters();
    const params = ((this.grid as ActionGridComponent<any>).grid as MetadataGridComponent<any>).grid.getRequestParams();
    const grid = (this.grid as ActionGridComponent<any>);
    let columns: any, request: any;
    if (grid.grid) {
      columns = (grid.grid as MetadataGridComponent<any>).grid.getExportableColumns();
      request = (grid.grid as MetadataGridComponent<any>).grid.buildRequest(params, filters);
      // grid.grid.deselectAll();
    } else {
      console.log('wrong component using');
    }
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
    return filters.addFilter((this.grid.grid as MetadataGridComponent<any>).getFilters());
  }
}
