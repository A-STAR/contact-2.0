import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
  IActionLog,
  IActionsLogData,
  IActionType,
  IEmployee,
  toFullName
} from './actions-log.interface';
import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IGrid2PaginationInfo } from '../../../shared/components/grid2/grid2.interface';

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
  static DEFAULT_PAGE_SIZE = 10;

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

  @ViewChild('filter') filter: ActionsLogFilterComponent;

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
    this.actionsLogData = this.actionsLogService.actionsLogRows;

    this.actionTypesRowsSubscription = this.actionTypesRows.subscribe((actionTypesRawRows: IActionType[]) =>
      this.actionTypesRawRows = actionTypesRawRows);
  }

  ngOnDestroy(): void {
    this.actionTypesRowsSubscription.unsubscribe();
  }

  onSearch(): void {
    this.doSearch({
      currentPage: 1,
      pageSize: ActionsLogComponent.DEFAULT_PAGE_SIZE
    });
  }

  onChangePage(pageInfo: IGrid2PaginationInfo): void {
    this.doSearch(pageInfo);
  }

  private doSearch(pageInfo: IGrid2PaginationInfo): void {
    this.actionsLogService.search(this.filter.getFilterValues(), {
      currentPage: pageInfo.currentPage,
      pageSize: pageInfo.pageSize
    });
  }
}
