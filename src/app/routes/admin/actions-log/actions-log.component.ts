import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IActionsLogData, IEmployee } from './actions-log.interface';
// import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IGrid2ColumnsSettings, IGrid2EventPayload } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

export const toFullName = (entity: { lastName: string, firstName: string, middleName: string }) => {
  return [ entity.lastName, entity.firstName, entity.middleName ]
    .filter(Boolean).join(' ');
};

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
  styleUrls: ['./actions-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsLogComponent {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IGridColumn[] = [
    { prop: 'id', minWidth: 60, type: 'id', filter: 'number' },
    { prop: 'fullName', minWidth: 200, filter: 'textFilter' },
    { prop: 'position', minWidth: 100, filter: 'textFilter' },
    { prop: 'createDateTime', minWidth: 130, suppressSizeToFit: true, type: 'date', filter: 'date' },
    { prop: 'guiObject', minWidth: 150, filter: 'textFilter' },
    { prop: 'typeCode', minWidth: 150, filter: 'set',
      filterOptionsDictionaryId: DictionariesService.DICTIONARY_CODES.USERS_ACTIONS_TYPES },
    { prop: 'dsc', minWidth: 200, filter: 'textFilter' },
    { prop: 'machine', minWidth: 120, filter: 'textFilter' },
    { prop: 'duration', minWidth: 100, type: 'number', filter: 'text' }
  ];

  columnDefs: Observable<IGridColumn[]>;

  renderers: IRenderer = {
    fullName: toFullName,
  };

  employeesRows: Observable<IEmployee[]>;
  actionTypesRows: Observable<IDictionaryItem[]>;
  actionsLogData: Observable<IActionsLogData>;
  actionsLogCurrentPage: Observable<number>;
  actionsLogCurrentPageSize: Observable<number>;
  actionsLogColumnsSettings: Observable<IGrid2ColumnsSettings>;
  actionsLogColumnMovingInProgress: Observable<boolean>;
  actionsLogSelectedRows: Observable<IDictionaryItem[]>;

  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  constructor(
    private actionsLogService: ActionsLogService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
  ) {
    this.columnDefs = this.gridService.getColumnDefs('actions', this.columns, this.renderers);
    this.employeesRows = this.actionsLogService.employeesRows;
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.actionsLogCurrentPage = this.actionsLogService.actionsLogCurrentPage;
    this.actionsLogCurrentPageSize = this.actionsLogService.actionsLogCurrentPageSize;
    this.actionsLogColumnsSettings = this.actionsLogService.actionsLogColumnsSettings;
    this.actionsLogColumnMovingInProgress = this.actionsLogService.actionsLogColumnMovingInProgress;
    this.actionsLogSelectedRows = this.actionsLogService.actionsLogSelectedRows;
  }

  onFilter(gridFilters: IGrid2EventPayload): void {
    const filters: any = this.filter.getFilterValues();
    filters.gridFilters = gridFilters;
    this.actionsLogService.search(filters);
  }

  onRequestData(payload: IGrid2EventPayload): void {
    this.onStoreDispatch(payload);
    this.doSearch();
  }

  onColumnAction(payload: IGrid2EventPayload): void {
    this.onStoreDispatch(payload);
  }

  onStoreDispatch(payload: IGrid2EventPayload): void {
    this.store.dispatch(payload);
  }

  doSearch(): void {
    this.actionsLogService.search(this.filter.getFilterValues());
  }

  doExport(): void {
    // TODO(d.maltsev): move into component/service
    const columns = this.grid.columnDefs.map(column => ({
      field: column.field,
      name: column.headerName
    }));

    const body = {
      columns,
      ...this.actionsLogService.createRequest({}, this.filter.getFilterValues())
    };

    this.actionsLogService.export(body)
      .catch(() => [ this.notificationsService.createErrorAction('actionsLog.messages.errors.download') ])
      .subscribe();
  }
}
