import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import {
  ICustomActionData,
  ICustomOperationResult,
  ICustomOperation,
  ICustomOperationParams,
  OperationControlTypeEnum
} from './custom-operation.interface';

import {
  IDynamicLayoutConfig,
  DynamicLayoutItemType,
  IDynamicLayoutItem,
  DynamicLayoutControlType
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { IGridActionPayload, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class CustomOperationService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  getOperationParams(operation: IGridAction): Observable<ICustomOperationParams[]> {
    return this.fetchOperationParams(operation.id)
      .map(params => this.filterInputParams(operation, params));
  }

  fetchOperations(operationType: number): Observable<ICustomOperation[]> {
    return this.dataService
      .readAll('/lookup/operations?operationType={operationType} ', { operationType })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.operations.gen.plural').dispatchCallback()),
      );
  }

  fetchOperationParams(operationId: number): Observable<ICustomOperationParams[]> {
    return this.dataService
      .readAll(`/operations/${operationId}/params`)
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.operations.gen.singular').dispatchCallback()),
      );
  }

  run(operation: IGridAction, params: ICustomOperationParams[], data: ICustomActionData): Observable<ICustomActionData> {
    const idData = this.createIdData(operation, params, data);
    const actionData = this.filterActionData(idData, data);
    return operation.asyncMode
      ? this.schedule(operation.id, idData, actionData)
      : this.execute(operation.id, idData, actionData);
  }

  execute(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/synch/mass/customOperation', {}, {
      operationId,
      idData,
      actionData
    })
    .pipe(
      catchError(this.notificationsService
        .error('errors.default.customMassOp')
        .dispatchCallback()
      )
    );
  }

  schedule(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/asynch/mass/customOperation', {}, {
      operationId,
      idData,
      actionData
    })
    .pipe(
      catchError(this.notificationsService
        .error('errors.default.customMassOp')
        .dispatchCallback()
      )
    );
  }

  showResultMessage(result: ICustomOperationResult): void {
    const { total, processed } = result;
    if (total != null && processed != null) {
      if (total && processed) {
        this.notificationsService
          .info('default.dialog.result.message')
          .params({
            total: `${total}`,
            processed: `${processed}`,
          })
          .dispatch();
      }
    }
  }

  getActionInputParamsConfig(key: string, params: ICustomOperationParams[]): IDynamicLayoutConfig {
    return {
      key,
      items: params.sort((p1, p2) => p1.sortOrder - p2.sortOrder).map(param => ({
        label: param.name,
        name: param.systemName,
        type: DynamicLayoutItemType.CONTROL,
        validators: {
          required: !!param.isMandatory,
        },
        ...this.getActionParamControlOptions(param)
      }) as IDynamicLayoutItem),
    };
  }

  private getActionParamControlOptions(param: ICustomOperationParams): Partial<IDynamicLayoutItem> {
    switch (param.paramTypeCode) {
      case OperationControlTypeEnum.DATE:
        return {
          controlType: DynamicLayoutControlType.DATE
        };
      case OperationControlTypeEnum.NUMBER:
        return {
          controlType: DynamicLayoutControlType.NUMBER
        };
      case OperationControlTypeEnum.TEXT:
        return {
          controlType: DynamicLayoutControlType.TEXT
        };
      case OperationControlTypeEnum.PORTFOLIOS:
      case OperationControlTypeEnum.OUTGOING_PORTFOLIOS:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'portfolios',
          filterParams: { directionCodes: [ 1 ] }
        } as Partial<IDynamicLayoutItem>;
      case OperationControlTypeEnum.OPERATORS:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'users'
        } as Partial<IDynamicLayoutItem>;
      case OperationControlTypeEnum.CONTRACTORS:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'contractors'
        } as Partial<IDynamicLayoutItem>;
      case OperationControlTypeEnum.DICTIONARY:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.MULTISELECT
            : DynamicLayoutControlType.SELECT,
          dictCode: param.dictNameCode
        } as Partial<IDynamicLayoutItem>;
      case OperationControlTypeEnum.CHECKBOX:
        return {
          controlType: DynamicLayoutControlType.CHECKBOX
        };
      case OperationControlTypeEnum.DATETIME:
        return {
          controlType: DynamicLayoutControlType.DATETIME
        };
      case OperationControlTypeEnum.GROUP:
        return {
          controlType: DynamicLayoutControlType.GRIDSELECT,
          filterType: 'entityGroups',
          filterParams: {
            entityTypeIds: param.entityTypeIds
          }
        } as Partial<IDynamicLayoutItem>;
      case OperationControlTypeEnum.LOOKUP:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.MULTISELECT
            : DynamicLayoutControlType.SELECT,
          lookupKey: param.lookupKey
        } as Partial<IDynamicLayoutItem>;
    }
  }

  private createIdData(operation: IGridAction, params: ICustomOperationParams[], actionData: ICustomActionData): any {
    return {
      ...operation.params.reduce((acc, param, i) => ({
        ...acc,
        [param]: {
          ids: Array.isArray(operation.payload.data)
            ? (operation.payload.data as number[][]).map(row => [ row[i] ])
            : [ [operation.payload.data[param]] ]
        }
      }), {}),
      ...(params || [])
        .filter(p => p.paramTypeCode === 0)
        .reduce((acc, p) => ({
          ...acc,
          [p.systemName]: {
            ids: (
              Array.isArray(actionData[p.systemName])
                ? actionData[p.systemName]
                : [ actionData[p.systemName] ]
            ).map(param => [ param ])
          }
        }), {})
    };
  }

  private filterActionData(idData: any, actionData: ICustomActionData): ICustomActionData {
    return Object.keys(actionData).reduce((acc, field) => ({
      ...acc,
      ...(!idData[field] ? { [field]: actionData[field] } : {})
    }), {});
  }

  private filterInputParams(operation: IGridAction, params: ICustomOperationParams[]): ICustomOperationParams[] {
    return params.filter(p => !operation.params.includes(p.systemName));
  }
}
