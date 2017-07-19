import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IActionsLogData, IEmployee } from './actions-log.interface';
import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';
import { IRenderer } from '../../../shared/components/grid/grid.interface';
import { IAGridColumn, IGrid2EventPayload } from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { toFullName } from '../../../core/utils';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';
import { DownloaderComponent } from '../../../shared/components/downloader/downloader.component';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
  styleUrls: ['./actions-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsLogComponent {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IAGridColumn[] = [
    { colId: 'id', minWidth: 60, type: 'primary', filter: 'number' },
    { colId: 'fullName', minWidth: 200, filter: 'text' },
    { colId: 'position', minWidth: 100, filter: 'text' },
    { colId: 'createDateTime', minWidth: 130, type: 'date', filter: 'date' },
    { colId: 'guiObject', minWidth: 150, filter: 'text', localized: true },
    { colId: 'typeCode', minWidth: 150, filter: 'set',
      filterDictionaryId: DictionariesService.DICTIONARY_CODES.USERS_ACTIONS_TYPES
    },
    { colId: 'dsc', minWidth: 200, filter: 'text' },
    { colId: 'machine', minWidth: 120, filter: 'text' },
    { colId: 'duration', minWidth: 100, type: 'number', filter: 'number' }
  ];

  columnDefs: Observable<IAGridColumn[]>;

  renderers: IRenderer = {
    fullName: toFullName,
  };

  employeesRows: Observable<IEmployee[]>;
  actionTypesRows: Observable<IDictionaryItem[]>;
  actionsLogData: Observable<IActionsLogData>;
  actionsLogCurrentPage: Observable<number>;
  actionsLogCurrentPageSize: Observable<number>;
  actionsLogSelected: Observable<IDictionaryItem[]>;

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('filter') filter: ActionsLogFilterComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  constructor(
    private actionsLogService: ActionsLogService,
    private gridService: GridService,
    private store: Store<IAppState>,
    private translateService: TranslateService,
  ) {
    this.columnDefs = this.gridService.getColumnDefs('actions', this.columns, this.renderers);
    this.employeesRows = this.actionsLogService.employeesRows;
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.actionsLogCurrentPage = this.actionsLogService.actionsLogCurrentPage;
    this.actionsLogCurrentPageSize = this.actionsLogService.actionsLogCurrentPageSize;
    this.actionsLogSelected = this.actionsLogService.actionsLogSelected;
  }

  onFilter(gridFilters: FilterObject): void {
    const filters = this.filter.getFilters();
    filters.addFilter(gridFilters);
    this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.actionsLogService.filter(filters);
  }

  onRequestData(payload: IGrid2EventPayload): void {
    const filters = this.filter.getFilters();
    filters.addFilter(this.grid.getFilters());
    this.store.dispatch(payload);
    this.actionsLogService.fetch(filters);
  }

  onSelect(payload: IGrid2EventPayload): void {
    this.store.dispatch(payload);
  }

  doSearch(): void {
    const filters = this.filter.getFilters();
    filters.addFilter(this.grid.getFilters());
    this.store.dispatch({ type: Grid2Component.FIRST_PAGE });
    this.actionsLogService.filter(filters);
  }

  doExport(): void {
    const filters = this.filter.getFilters();
    filters.addFilter(this.grid.getFilters());
    const sorters = this.grid.getSorters();
    const { pageSize, page: currentPage } = this.grid;
    const gridRequestParams = { currentPage, pageSize, sorters };
    const request = this.gridService.buildRequest(gridRequestParams, filters);
    const columns = this.grid.getExportableColumns();
    const body = { columns, ...request };

    this.downloader.download(body);
  }

}
