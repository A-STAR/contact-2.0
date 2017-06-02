import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionLog, IActionType, IEmployee } from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { DateConverterService } from '../../../core/converter/date/date-converter.service';

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
    createDateTime: (actionLog: IActionLog) => this.dateConverterService.formatDate(actionLog.createDateTime, true)
  };

  employeesRows: IEmployee[];
  actionTypesRows: IActionType[];
  actionsRows: Array<IActionLog> = [];

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private dateConverterService: DateConverterService,
    private notifications: NotificationsService,
  ) {

    const [ employees, actionTypes ] = this.route.snapshot.data.actionsLogData;
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.employeesRows = employees;
    this.actionTypesRows = actionTypes;
  }

  onSearch(filterValues: IActionsLogFilterRequest): void {
    this.gridService
      .read('/actions')
      .subscribe(
        (data) => this.actionsRows = data.actions,
        error => this.notifications.error('Could not fetch data from the server')
      );
  }
}
