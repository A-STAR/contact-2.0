import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IActionLog, IActionType, IEmployee, toFullName } from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

import { ActionsLogService } from './actions-log.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements OnDestroy {
  static COMPONENT_NAME = 'ActionsLogComponent';

  columns: IGridColumn[] = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position', minWidth: 100 },
    { prop: 'createDateTime', width: 150, maxWidth: 150, suppressSizeToFit: true },
    { prop: 'module' },
    { prop: 'typeCode' },
    { prop: 'dsc', minWidth: 150 },
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
  actionsLogRows: Observable<IActionLog[]>;

  private actionTypesRawRows: IActionType[];
  private actionTypesRowsSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private converterService: ValueConverterService,
    private actionsLogService: ActionsLogService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.employeesRows = this.actionsLogService.employeesRows;
    this.actionTypesRows = this.actionsLogService.actionTypesRows;
    this.actionsLogRows = this.actionsLogService.actionsLogRows;

    this.actionTypesRowsSubscription = this.actionTypesRows.subscribe((actionTypesRawRows: IActionType[]) =>
      this.actionTypesRawRows = actionTypesRawRows);
  }

  ngOnDestroy(): void {
    this.actionTypesRowsSubscription.unsubscribe();
  }

  onSearch(filterValues: IActionsLogFilterRequest): void {
    this.actionsLogService.search(filterValues);
  }
}
