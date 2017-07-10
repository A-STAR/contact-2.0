import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import {
  IActionLog,
  IActionsLogData,
  IActionsLogPayload,
  IEmployee
} from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';
import {
  IGrid2ColumnsSettings,
  IGrid2Request,
  IGrid2RequestPayload,
  IGrid2State
} from '../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Injectable()
export class ActionsLogService {
  static ACTION_TYPES_FETCH_SUCCESS           = 'ACTION_TYPES_FETCH_SUCCESS';
  static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS  = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  static ACTIONS_LOG_FETCH                    = 'ACTIONS_LOG_FETCH';
  static ACTIONS_LOG_FETCH_SUCCESS            = 'ACTIONS_LOG_FETCH_SUCCESS';
  static ACTIONS_LOG_DESTROY                  = 'ACTIONS_LOG_DESTROY';

  @Effect() onSearchEffect = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .withLatestFrom(this.store)
    .switchMap(
      (payload): Observable<IActionsLogPayload> => {
        const [action, store]: [Action, IAppState] = payload;
        const customFilter: IActionsLogFilterRequest = action.payload;
        // console.log('action payload', action.payload);
        const grid: IGrid2State = store.actionsLog.actionsLogGrid;
        // TODO(a.tymchuk): refactor this
        const request = this.createRequest(
          {
            currentPage: grid.currentPage,
            pageSize: grid.pageSize,
            columnsSettings: grid.columnsSettings,
            // fieldNameConverter: (fieldName: string) => fieldName === 'fullName' ? 'lastName' : fieldName,
          },
          customFilter
        );

        return this.dataService.create('/list?name=actions', {}, request)
          .map((data: { data: IActionLog[], total: number }): IActionsLogPayload => {
            return {
              payload: {
                data: data.data,
                total: data.total
              },
              type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
            };
          })
          .catch(() => [ this.notifications.createErrorAction('actionsLog.messages.errors.fetch') ]);
      }
    );

  constructor(
    private dataService: DataService,
    private effectActions: Actions,
    private gridService: GridService,
    private notifications: NotificationsService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {}

  get actionsLogCurrentPage(): Observable<number> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.currentPage)
      .distinctUntilChanged();
  }

  get actionsLogCurrentPageSize(): Observable<number> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.pageSize)
      .distinctUntilChanged();
  }

  get actionsLogColumnsSettings(): Observable<IGrid2ColumnsSettings> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.columnsSettings)
      .distinctUntilChanged();
  }

  get actionsLogColumnMovingInProgress(): Observable<boolean> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.columnMovingInProgress)
      .distinctUntilChanged();
  }

  get actionsLogSelectedRows(): Observable<IDictionaryItem[]> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.selectedRows)
      .distinctUntilChanged();
  }

  get actionsLogRows(): Observable<IActionsLogData> {
    return this.store
      .select(state => state.actionsLog.actionsLog)
      .distinctUntilChanged();
  }

  get employeesRows(): Observable<IEmployee[]> {
    return this.store
      .select(state => state.actionsLog.employees)
      .distinctUntilChanged();
  }

  get actionTypesRows(): Observable<IDictionaryItem[]> {
    return this.store
      .select(state => state.actionsLog.actionTypes)
      .distinctUntilChanged();
  }

  createRequest(payload: IGrid2RequestPayload, customFilter: IActionsLogFilterRequest): IGrid2Request {
    if (customFilter.gridFilters) {
      payload.gridFilters = customFilter.gridFilters;
    }
    const request: IGrid2Request = this.gridService.buildRequest(payload);

    request.filtering = FilterObject.create()
      .and()
      .addFilter(request.filtering)
      .addFilter(
        FilterObject.create()
          .setName('createDateTime')
          .betweenOperator()
          .setValues([
            this.valueConverterService.isoFromLocalDateTime(customFilter.startDate + ' ' + customFilter.startTime),
            this.valueConverterService.isoFromLocalDateTime(customFilter.endDate + ' ' + customFilter.endTime),
          ])
      )
      .addFilter(
        FilterObject.create()
          .setName('typeCode')
          .inOperator()
          .setValues(customFilter.actionsTypes)
      )
      .addFilter(
        FilterObject.create()
          .setName('userId')
          .inOperator()
          .setValues(customFilter.employees)
      );

    return request;
  }

  getEmployeesAndActionTypes(): Observable<void> {
    return Observable.zip(
      this.getEmployees(),
      this.getActionTypes(),
      (employees, actionTypes) => {
        this.store.dispatch({
          payload: employees,
          type: ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS,
        });
        this.store.dispatch({
          payload: actionTypes,
          type: ActionsLogService.ACTION_TYPES_FETCH_SUCCESS,
        });
      }
    );
  }

  fetch(payload: IActionsLogFilterRequest): void {
    this.store.dispatch({
      payload,
      type: ActionsLogService.ACTIONS_LOG_FETCH,
    });
  }

  filter(payload: IActionsLogFilterRequest): void {
    this.store.dispatch({
      payload: { ...payload, currentPage: 1 },
      type: ActionsLogService.ACTIONS_LOG_FETCH,
    });
  }

  destroy(): void {
    this.store.dispatch({ type: ActionsLogService.ACTIONS_LOG_DESTROY });
  }

  getActionTypes(): Observable<IDictionaryItem[]> {
    return this.dataService.read('/dictionaries/{code}/terms', {
      code: DictionariesService.DICTIONARY_CODES.USERS_ACTIONS_TYPES
    }).map(data => data.terms);
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.dataService.read('/users').map(data => data.users);
  }
}
