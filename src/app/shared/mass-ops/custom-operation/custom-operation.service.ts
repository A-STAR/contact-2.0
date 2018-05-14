import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { ICustomOperationData } from './custom-operation.interface';
import { IGridActionPayload, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class CustomOperationService {

  constructor(
    private dataService: DataService,
    private actionGridService: ActionGridService,
    private notificationsService: NotificationsService
  ) {}

  run(operation: IGridAction, idData: IGridActionPayload, actionData: ICustomOperationData): Observable<void> {
    return operation.asyncMode
      ? this.schedule(operation.id, idData, actionData)
      : this.execute(operation.id, idData, actionData);
  }

  execute(operationId: number, idData: IGridActionPayload, actionData: ICustomOperationData): Observable<void> {
    return this.dataService.create('synch/mass/customOperation', {}, {
      operationId,
      idData: this.actionGridService.buildRequest(idData),
      actionData
    })
    .pipe(
      catchError(this.notificationsService.updateError().entity('entities.workTask.gen.plural').dispatchCallback())
    );
  }

  schedule(operationId: number, idData: IGridActionPayload, actionData: ICustomOperationData): Observable<void> {
    return this.dataService.create('asynch/mass/customOperation', {}, {
      operationId,
      idData: this.actionGridService.buildRequest(idData),
      actionData
    })
    .pipe(
      catchError(this.notificationsService.updateError().entity('entities.workTask.gen.plural').dispatchCallback())
    );
  }
}
