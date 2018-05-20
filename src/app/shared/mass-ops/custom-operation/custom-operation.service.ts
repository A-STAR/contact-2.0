import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICustomActionData, ICustomActionResult } from './custom-operation.interface';

import {
  IDynamicLayoutConfig,
  DynamicLayoutItemType,
  IDynamicLayoutItem,
  DynamicLayoutControlType
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { IGridActionPayload, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IMetadataActionParamConfig } from '@app/core/metadata/metadata.interface';
import { ILookupOperation } from '@app/core/lookup/lookup.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class CustomOperationService {

  private operations: ILookupOperation[];

  constructor(
    private dataService: DataService,
    private actionGridService: ActionGridService,
    private notificationsService: NotificationsService
  ) {
    // TODO (i.kibisov): remove mock
    of([ { id: 5, name: 'rectangularDistribution' } ])
      .subscribe(operations => this.operations = operations);
  }

  isAllowedOperation(id: number): boolean {
    return !!this.operations.find(o => o.id === id);
  }

  run(operation: IGridAction, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return operation.asyncMode
      ? this.schedule(operation.id, idData, actionData)
      : this.execute(operation.id, idData, actionData);
  }

  // TODO (i.kibisov): remove mock
  execute(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/synch/mass/customOperation', {}, {
      operationId,
      idData: {
        debtId: this.actionGridService.buildRequest(idData),
        operatorId: { ids: actionData.operatorId.map(p => [p]) }
      }
    })
    .pipe(
      catchError(this.notificationsService
        .error('errors.default.massOp')
        .entity('  ')
        .dispatchCallback()
      )
    );
  }

  schedule(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/asynch/mass/customOperation', {}, {
      operationId,
      idData: this.actionGridService.buildRequest(idData),
      actionData
    })
    .pipe(
      catchError(this.notificationsService
        .error('errors.default.massOp')
        .entity('  ')
        .dispatchCallback()
      )
    );
  }

  showResultMessage(result: ICustomActionResult): void {
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
}
