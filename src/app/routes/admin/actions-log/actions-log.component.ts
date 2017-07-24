import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import { Store } from '@ngrx/store';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IActionsLogData, IEmployee } from './actions-log.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { IRenderer } from '../../../shared/components/grid/grid.interface';
import { IAGridColumn, IAGridEventPayload } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { toFullName } from '../../../core/utils';

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
export class ActionsLogComponent implements AfterViewInit, OnDestroy, OnInit {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IAGridColumn[] = [
    { colId: 'id', minWidth: 60, type: 'primary', filter: 'number' },
    { colId: 'fullName', minWidth: 200, filter: 'text' },
    { colId: 'position', minWidth: 100, filter: 'text' },
    { colId: 'createDateTime', minWidth: 130, type: 'date', filter: 'date' },
    { colId: 'guiObject', minWidth: 150, filter: 'text' },
    { colId: 'typeCode', minWidth: 150, filter: 'set',
      filterDictionaryId: UserDictionariesService.DICTIONARY_ACTION_TYPES
    },
    { colId: 'dsc', minWidth: 200, filter: 'text' },
    { colId: 'machine', minWidth: 120, filter: 'text' },
    { colId: 'duration', minWidth: 100, type: 'number', filter: 'number' }
  ];

  // columnDefs: Observable<IAGridColumn[]>;
  columnDefs: IAGridColumn[];

  renderers: IRenderer = {
    fullName: toFullName,
  };
  // filter
  actionTypesRows: Observable<IDictionaryItem[]>;
  employeesRows: Observable<IEmployee[]>;
  // grid
  actionsLogData: Observable<IActionsLogData>;
  actionsLogCurrentPage: Observable<number>;
  actionsLogCurrentPageSize: Observable<number>;
  actionsLogSelected: Observable<IDictionaryItem[]>;
  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // filter
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.employeesRows = this.actionsLogService.employeesRows;
    // grid
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.actionsLogCurrentPage = this.actionsLogService.actionsLogCurrentPage;
    this.actionsLogCurrentPageSize = this.actionsLogService.actionsLogCurrentPageSize;
    this.actionsLogSelected = this.actionsLogService.actionsLogSelected;
    // this.columnDefs = Observable.combineLatest(this.gridService
    //   .getColumnDefs('actions', this.columns, this.renderers))
    //   .map(([columns]) => columns);
  }

  ngOnInit(): void {
    this.gridService
      .getColumnDefs('actions', this.columns, this.renderers)
      .take(1)
      .subscribe(
        (columns) => { this.columnDefs = columns; this.cdRef.markForCheck(); }
      );
  }

  ngAfterViewInit(): void {
    this.hasViewPermission$ = this.userPermissionsService.has('ACTION_LOG_VIEW');

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

  // onBeforeEdit(): void {
  //   const permission = 'ACTION_LOG_VIEW';
  //   this.userPermissionsService.has(permission)
  //     .take(1)
  //     .subscribe(hasPermission => {
  //       if (hasPermission) {
  //         this.display = true;
  //       } else {
  //         this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
  //       }
  //     });
  // }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  onFilter(gridFilters: any): void {
    const filters = this.getCombinedFilters().addFilters(gridFilters);
    this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.actionsLogService.filter(filters);
  }

  onRequestData(payload: IAGridEventPayload): void {
    const filters = this.getCombinedFilters();
    this.store.dispatch(payload);
    if (this.grid.rowCount) {
      this.actionsLogService.fetch(filters);
    }
  }

  onSelect(payload: IAGridEventPayload): void {
    this.store.dispatch(payload);
  }

  doSearch(): void {
    const filters = this.getCombinedFilters();
    this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
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

  private getCombinedFilters(): FilterObject {
    const filters = this.filter.getFilters();
    return filters.addFilter(this.grid.getFilters());
  }

}
