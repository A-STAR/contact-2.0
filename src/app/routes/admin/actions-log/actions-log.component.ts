import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';
import { Column } from 'ag-grid';

import {
  IActionLog,
  IActionsLogData,
  IActionType,
  IEmployee,
  toFullName
} from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import {
  IGrid2ColumnsSettings,
  IGrid2EventPayload
} from '../../../shared/components/grid2/grid2.interface';
import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { ActionsLogFilterComponent } from './filter/actions-log-filter.component';

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
  styleUrls: ['./actions-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActionsLogComponent implements OnDestroy {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IGridColumn[] = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position', minWidth: 100 },
    { prop: 'createDateTime', minWidth: 150, suppressSizeToFit: true },
    { prop: 'module', minWidth: 150 },
    { prop: 'typeCode', minWidth: 150 },
    { prop: 'dsc', minWidth: 200 },
    { prop: 'machine', minWidth: 100 },
    { prop: 'duration', minWidth: 100 }
  ];

  renderers: IRenderer = {
    fullName: toFullName,
    typeCode: (actionLog: IActionLog) => {
      const currentActionType: IActionType =
        this.actionTypesRawRows.find((actionType: IActionType) => actionType.code === actionLog.typeCode);
      return currentActionType ? currentActionType.name : actionLog.typeCode;
    },
    createDateTime: (actionLog: IActionLog) => this.converterService.formatDate(actionLog.createDateTime, true)
  };

  employeesRows: Observable<IEmployee[]>;
  actionTypesRows: Observable<IActionType[]>;
  actionsLogData: Observable<IActionsLogData>;
  actionsLogCurrentPage: Observable<number>;
  actionsLogCurrentPageSize: Observable<number>;
  actionsLogCurrentFilterColumn: Observable<Column>;
  actionsLogColumnsSettings: Observable<IGrid2ColumnsSettings>;
  actionsLogColumnMovingInProgress: Observable<boolean>;

  @ViewChild('filter') filter: ActionsLogFilterComponent;

  private actionTypesRawRows: IActionType[];
  private actionTypesRowsSubscription: Subscription;

  constructor(
    private store: Store<IAppState>,
    private gridService: GridService,
    private converterService: ValueConverterService,
    private actionsLogService: ActionsLogService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.employeesRows = this.actionsLogService.employeesRows;
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.actionsLogData = this.actionsLogService.actionsLogRows;
    this.actionsLogCurrentPage = this.actionsLogService.actionsLogCurrentPage;
    this.actionsLogCurrentPageSize = this.actionsLogService.actionsLogCurrentPageSize;
    this.actionsLogCurrentFilterColumn = this.actionsLogService.actionsLogCurrentFilterColumn;
    this.actionsLogColumnsSettings = this.actionsLogService.actionsLogColumnsSettings;
    this.actionsLogColumnsSettings = this.actionsLogService.actionsLogColumnsSettings;
    this.actionsLogColumnMovingInProgress = this.actionsLogService.actionsLogColumnMovingInProgress;

    this.actionTypesRowsSubscription = this.actionTypesRows.subscribe((actionTypesRawRows: IActionType[]) =>
      this.actionTypesRawRows = actionTypesRawRows);
  }

  ngOnDestroy(): void {
    this.actionTypesRowsSubscription.unsubscribe();
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
}
