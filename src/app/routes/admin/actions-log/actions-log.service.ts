import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';
import { Column } from 'ag-grid';

import {
  IActionLog,
  IActionsLogData,
  IActionsLogPayload,
  IActionType,
  IEmployee
} from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';
import {
  IGrid2ColumnsSettings,
  IGrid2Request,
  IGrid2State
} from '../../../shared/components/grid2/grid2.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';
import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';

@Injectable()
export class ActionsLogService {
  static ACTION_TYPES_FETCH_SUCCESS = 'ACTION_TYPES_FETCH_SUCCESS';
  static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  static ACTIONS_LOG_FETCH = 'ACTIONS_LOG_FETCH';
  static ACTIONS_LOG_FETCH_SUCCESS = 'ACTIONS_LOG_FETCH_SUCCESS';
  static ACTIONS_LOG_DESTROY = 'ACTIONS_LOG_DESTROY';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
    private effectActions: Actions,
    private notifications: NotificationsService,
    private valueConverterService: ValueConverterService
  ) {
  }

  get actionsLogCurrentPage(): Observable<number> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.currentPage)
      .distinctUntilChanged();
  }

  get actionsLogCurrentPageSize(): Observable<number> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.pageSize)
      .distinctUntilChanged();
  }

  get actionsLogCurrentFilterColumn(): Observable<Column> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.currentFilterColumn)
      .distinctUntilChanged();
  }

  get actionsLogColumnsSettings(): Observable<IGrid2ColumnsSettings> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.columnsSettings)
      .distinctUntilChanged();
  }

  get actionsLogColumnMovingInProgress(): Observable<boolean> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.columnMovingInProgress)
      .distinctUntilChanged();
  }

  get actionsLogSelectedRows(): Observable<IActionType[]> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLogGrid.selectedRows)
      .distinctUntilChanged();
  }

  get actionsLogRows(): Observable<IActionsLogData> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLog)
      .distinctUntilChanged();
  }

  get employeesRows(): Observable<IEmployee[]> {
    return this.store
      .select((state: IAppState) => state.actionsLog.employees)
      .distinctUntilChanged();
  }

  get actionTypesRows(): Observable<IActionType[]> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionTypes)
      .distinctUntilChanged();
  }

  getEmployeesAndActionTypes(): Observable<void> {
    return Observable.zip(
      this.getEmployees(),
      this.getActionTypes(),
      (employees, actionTypes) => {
        this.store.dispatch({
          type: ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS,
          payload: employees
        });
        this.store.dispatch({
          type: ActionsLogService.ACTION_TYPES_FETCH_SUCCESS,
          payload: actionTypes
        });
      }
    );
  }

  @Effect() onSearchEffect = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .withLatestFrom(this.store)
    .switchMap(
      (payload): Observable<IActionsLogPayload> => {
        const [action, store]: [Action, IAppState] = payload;
        const customFilter: IActionsLogFilterRequest = action.payload;
        const state: IGrid2State = store.actionsLog.actionsLogGrid;
        const request: IGrid2Request = this.valueConverterService
          .toGridRequest({
            currentPage: state.currentPage,
            pageSize: state.pageSize,
            columnsSettings: state.columnsSettings,
            fieldNameConverter: (fieldName: string) => {
              switch (fieldName) {
                case 'fullName':
                  return 'lastName';
                default:
                  return fieldName;
              }
            }
          });

        request.filtering = FilterObject.create()
          .and()
          .addFilter(request.filtering)
          .addFilter(
            FilterObject.create()
              .setName('createDateTime')
              .betweenOperator()
              .setValueArray([
                this.valueConverterService.toIsoDateTime(customFilter.startDate + ' ' + customFilter.startTime, true),
                this.valueConverterService.toIsoDateTime(customFilter.endDate + ' ' + customFilter.endTime, true),
              ])
          )
          .addFilter(
            FilterObject.create()
              .setName('typeCode')
              .inOperator()
              .setValueArray(customFilter.actionsTypes)
          )
          .addFilter(
            FilterObject.create()
              .setName('userId')
              .inOperator()
              .setValueArray(customFilter.employees)
          );

        return this.gridService.create('/actions/grid', {}, request)
          .map((data: { data: IActionLog[], total: number }): IActionsLogPayload => {
            return {
              type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
              payload: {
                data: data.data,
                total: data.total
              }
            };
          });
      }
    ).catch(() => {
      this.notifications.error('actionsLog.actionsLog.messages.errors.fetch');
      return null;
    });

  search(payload: IActionsLogFilterRequest): void {
    this.store.dispatch({
      type: ActionsLogService.ACTIONS_LOG_FETCH,
      payload: payload
    });
  }

  destroy(): void {
    this.store.dispatch({ type: ActionsLogService.ACTIONS_LOG_DESTROY });
  }

  getActionTypes(): Observable<IActionType[]> {
    // TODO Move dict type
    return this.gridService.read('/dictionaries/{code}/terms', { code: 4 }).map(data => data.terms);
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.gridService.read('/users').map(data => data.users);
  }
}
