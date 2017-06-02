import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IActionLog, IActionsLogServiceState, IActionType, IEmployee } from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

import { ActionsLogService } from './actions-log.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html'
})
export class ActionsLogComponent {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IGridColumn[] = [
    { prop: 'fullName', minWidth: 230, maxWidth: 200 },
    { prop: 'position', maxWidth: 150 },
    { prop: 'createDateTime', maxWidth: 150 },
    { prop: 'module', maxWidth: 140 },
    { prop: 'typeCode', maxWidth: 190 },
    { prop: 'dsc', minWidth: 110 },
    { prop: 'machine', maxWidth: 120 },
    { prop: 'duration', maxWidth: 120 }
  ];

  renderers: IRenderer = {
    fullName: (actionLog: IActionLog) =>
      [actionLog.lastName, actionLog.firstName, actionLog.middleName].filter((part: string) => !!part).join(' '),
    typeCode: (actionLog: IActionLog) => {
      const currentActionType: IActionType =
        this.actionTypesRows.find((actionType: IActionType) => actionType.code === actionLog.typeCode);
      return currentActionType ? currentActionType.name : actionLog.typeCode;
    },
    createDateTime: (actionLog: IActionLog) => this.converterService.formatDate(actionLog.createDateTime, true)
  };

  employeesRows: IEmployee[];
  actionTypesRows: IActionType[];
  actionsLogRows: Array<IActionLog> = [];

  private actionLogsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private converterService: ValueConverterService,
    private actionsLogService: ActionsLogService,
  ) {
    const [ employees, actionTypes ] = this.route.snapshot.data.actionsLogData;
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.employeesRows = employees;
    this.actionTypesRows = actionTypes;

    this.actionLogsSubscription = this.actionsLogService.state
      .subscribe((state: IActionsLogServiceState) => this.actionsLogRows = state.actionsLog);
  }

  onSearch(filterValues: IActionsLogFilterRequest): void {
    this.actionsLogService.search(filterValues);
  }
}
