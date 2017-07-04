import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Column } from 'ag-grid';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IActionsLogData, IEmployee } from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IGrid2ColumnsSettings, IGrid2EventPayload } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';

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
    { prop: 'id', minWidth: 60, filter: 'number' },
    { prop: 'fullName', minWidth: 200, filter: 'textFilter' },
    { prop: 'position', minWidth: 100, filter: 'textFilter' },
    { prop: 'createDateTime', minWidth: 130, suppressSizeToFit: true, filter: 'date' },
    { prop: 'guiObject', minWidth: 150, filter: 'textFilter' },
    { prop: 'typeCode', minWidth: 150, filter: 'set',
      filterOptionsDictionaryId: DictionariesService.DICTIONARY_CODES.USERS_ACTIONS_TYPES },
    { prop: 'dsc', minWidth: 200, filter: 'textFilter' },
    { prop: 'machine', minWidth: 120, filter: 'textFilter' },
    { prop: 'duration', minWidth: 120, filter: 'text' }
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
  actionsLogCurrentFilterColumn: Observable<Column>;
  actionsLogColumnsSettings: Observable<IGrid2ColumnsSettings>;
  actionsLogColumnMovingInProgress: Observable<boolean>;
  actionsLogSelectedRows: Observable<IDictionaryItem[]>;

  @ViewChild('filter') filter: ActionsLogFilterComponent;

  constructor(
    private actionsLogService: ActionsLogService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
  ) {
    this.columnDefs = this.gridService.getColumnDefs('Actions', this.columns, this.renderers);
    this.employeesRows = this.actionsLogService.employeesRows;
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.actionsLogCurrentPage = this.actionsLogService.actionsLogCurrentPage;
    this.actionsLogCurrentPageSize = this.actionsLogService.actionsLogCurrentPageSize;
    this.actionsLogCurrentFilterColumn = this.actionsLogService.actionsLogCurrentFilterColumn;
    this.actionsLogColumnsSettings = this.actionsLogService.actionsLogColumnsSettings;
    this.actionsLogColumnMovingInProgress = this.actionsLogService.actionsLogColumnMovingInProgress;
    this.actionsLogSelectedRows = this.actionsLogService.actionsLogSelectedRows;

    this.columnDefs.subscribe(console.log);
  }

  refreshData(eventPayload: IGrid2EventPayload): void {
    this.onStoreDispatch(eventPayload);
    this.doSearch();
  }

  onStoreDispatch(eventPayload: IGrid2EventPayload): void {
    this.store.dispatch(eventPayload);
  }

  doSearch(): void {
    this.actionsLogService.search(this.filter.getFilterValues());
  }

  doExport(): void {
    const columns = this.columns.map(column => ({
      field: column.prop,
      // TODO(d.maltsev): can we get translations from the grid component?
      name: this.translateService.instant('actionsLog.grid.' + column.prop)
    }));

    const body = {
      columns,
      ...this.actionsLogService.createRequest({}, this.filter.getFilterValues())
    };

    this.actionsLogService.export(body)
      .catch(() => {
        this.notificationsService.error('actionsLog.messages.errors.download');
        return Observable.of(null);
      })
      .subscribe();
  }
}
