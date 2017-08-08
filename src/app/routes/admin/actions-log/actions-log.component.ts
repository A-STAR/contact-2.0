import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, OnDestroy, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { IActionsLogData, IEmployee } from './actions-log.interface';

import { IAGridColumn, IAGridEventPayload, IAGridSelected } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IQuery } from '../../../shared/components/qbuilder2/qbuilder2.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

import { ActionsLogService } from './actions-log.service';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { DownloaderComponent } from '../../../shared/components/downloader/downloader.component';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

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
  actionTypesRows: Observable<IDictionaryItem[]>;
  employeesRows: Observable<IEmployee[]>;
  // grid
  actionsLogData: Observable<IActionsLogData>;
  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;

  query$ = new BehaviorSubject<IQuery>(null);

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  constructor(
    private actionsLogService: ActionsLogService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    // filter
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.employeesRows = this.actionsLogService.employeesRows;
    // grid
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.hasViewPermission$ = this.userPermissionsService.has('ACTION_LOG_VIEW');
  }

  get queryBuilderOpen$(): Observable<boolean> {
    return this.query$.map(query => query !== null);
  }

  ngAfterViewInit(): void {
    this.permissionSub = this.hasViewPermission$
      .filter(hasPermission => hasPermission !== undefined)
      .subscribe(hasPermission => {
        if (!hasPermission) {
          // this.actionsLogService.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.constants.gen.plural').dispatch();
        } else {
          this.actionsLogService.getEmployeesAndActionTypes()
            .take(1)
            .subscribe(
              () => {
                // const filters = this.getCombinedFilters();
                // this.actionsLogService.fetch(filters);
              }
            );
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  onFilter(gridFilters: any): void {
    const filters = this.getCombinedFilters();
    // this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.actionsLogService.filter(filters);
  }

  onPage(nextPage: number): void {
    console.log('nextPage', nextPage);
  }

  onRequestData(payload: IAGridEventPayload): void {
    const filters = this.getCombinedFilters();
    // this.store.dispatch(payload);
    if (this.grid.rowCount) {
      this.actionsLogService.fetch(filters);
    }
  }

  onSelect(selected: IAGridSelected): void {
    // this.store.dispatch(selected);
  }

  doSearch(): void {
    const filters = this.getCombinedFilters();
    // this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.actionsLogService.filter(filters);
  }

  doExport(): void {
    const filters = this.getCombinedFilters();
    const sorters = this.grid.getSorters();
    const { pageSize, page: currentPage } = this.grid;
    const gridRequestParams = { currentPage, pageSize, sorters };
    const request = this.gridService.buildRequest(gridRequestParams, filters);
    const columns = this.grid.getExportableColumns();
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
