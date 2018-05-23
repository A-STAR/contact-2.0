import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import {
  ICustomActionData,
  ICustomOperationResult,
  ICustomOperation,
  ICustomOperationParams
} from './custom-operation.interface';

import {
  IDynamicLayoutConfig,
  DynamicLayoutItemType,
  IDynamicLayoutItem,
  DynamicLayoutControlType
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { IGridActionPayload, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IMetadataActionParamConfig } from '@app/core/metadata/metadata.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class CustomOperationService {
  static TYPE_CUSTOM_OPERATION = 2;

  private operations: ICustomOperation[];

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {
    this.fetchOperations()
      .subscribe(operations => this.operations = operations);
  }

  isAllowedOperation(id: number): boolean {
    return !!this.operations.find(o => o.id === id);
  }

  getOperation(id: number): ICustomOperation {
    return this.operations.find(operation => operation.id === id);
  }

  getOperationParams(operation: IGridAction): Observable<ICustomOperationParams[]> {
    return this.dataService.readAll(`/operations/${operation.id}/params`)
      .map(params => this.filterInputParams(operation, params))
      .catch(this.notificationsService.fetchError().entity('entities.operations.gen.singular').dispatchCallback());
  }

  fetchOperations(): Observable<ICustomOperation[]> {
    return this.dataService.readAll('/lookup/operations?operationType={operationType} ', {
      operationType: CustomOperationService.TYPE_CUSTOM_OPERATION
    })
    .catch(this.notificationsService.fetchError().entity('entities.operations.gen.plural').dispatchCallback());
  }

  run(operation: IGridAction, actionData: ICustomActionData): Observable<ICustomActionData> {
    const idData = this.buildIdData(operation, actionData);
    const data = this.filterActionData(idData, actionData);
    return operation.asyncMode
      ? this.schedule(operation.id, idData, data)
      : this.execute(operation.id, idData, data);
  }

  execute(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/synch/mass/customOperation', {}, {
      operationId,
      idData,
      actionData
    })
    .pipe(
      catchError(this.notificationsService
        .error('errors.default.massOp')
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
        .error('errors.default.massOp')
        .dispatchCallback()
      )
    );
  }

  showResultMessage(result: ICustomOperationResult): void {
    this.notificationsService
      .info('default.dialog.result.message')
      .params({
        total: `${result.total}`,
        processed: `${result.processed}`
      })
      .dispatch();
  }

  getActionInputParamsConfig(key: string, params: IMetadataActionParamConfig[]): IDynamicLayoutConfig {
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

  private getActionParamControlOptions(param: IMetadataActionParamConfig): Partial<IDynamicLayoutItem> {
    switch (param.paramTypeCode) {
      case 1:
        return {
          controlType: DynamicLayoutControlType.DATE
        };
      case 2:
        return {
          controlType: DynamicLayoutControlType.NUMBER
        };
      case 6:
        return {
          controlType: DynamicLayoutControlType.TEXT
        };
      case 3:
      case 8:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'portfolios',
          filterParams: { directionCodes: [ 1 ] }
        } as Partial<IDynamicLayoutItem>;
      case 4:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'users'
        } as Partial<IDynamicLayoutItem>;
      case 5:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.DIALOGSELECT
            : DynamicLayoutControlType.GRIDSELECT,
          filterType: 'contractors'
        } as Partial<IDynamicLayoutItem>;
      case 7:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.MULTISELECT
            : DynamicLayoutControlType.SELECT,
          dictCode: param.dictNameCode
        } as Partial<IDynamicLayoutItem>;
      case 9:
        return {
          controlType: DynamicLayoutControlType.CHECKBOX
        };
      case 10:
        return {
          controlType: DynamicLayoutControlType.DATETIME
        };
      case 11:
        return {
          controlType: DynamicLayoutControlType.GRIDSELECT,
          filterType: 'entityGroups',
          filterParams: {
            entityTypeIds: param.entityTypeIds
          }
        } as Partial<IDynamicLayoutItem>;
      case 12:
        return {
          controlType: param.multiSelect
            ? DynamicLayoutControlType.MULTISELECT
            : DynamicLayoutControlType.SELECT,
          lookupKey: param.lookupKey
        } as Partial<IDynamicLayoutItem>;
    }
  }

  private buildIdData(operation: IGridAction, actionData: ICustomActionData): any {
    return operation.params.reduce((acc, param, i) => ({
      ...acc,
      [param]: {
        ids: operation.payload.data[0][i]
          ? (operation.payload.data as number[][]).map(row => [ row[i] ])
          : (Array.isArray(actionData[param]) ? actionData[param] : [ actionData[param] ]).map(p => [p])
      }
    }), {});
  }

  private filterActionData(idData: any, actionData: ICustomActionData): ICustomActionData {
    return Object.keys(actionData).reduce((acc, field) => ({
      ...acc,
      ...(!idData[field] ? { [field]: actionData[field] } : {})
    }), {});
  }

  private filterInputParams(operation: IGridAction, params: ICustomOperationParams[]): ICustomOperationParams[] {
    return params.filter(p => operation.params.indexOf(p.systemName));
  }
}
