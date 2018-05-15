import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICustomActionData } from './custom-operation.interface';
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

  run(operation: IGridAction, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    operation.asyncMode
      ? this.schedule(operation.id, idData, actionData)
      : this.execute(operation.id, idData, actionData);
    // TODO (i.kibisov): remove mock
    return of({
      success: true,
      data: [
        {
          'number_field': 123
        }
      ]
    });
  }

  execute(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/synch/mass/customOperation', {}, {
      operationId,
      idData: this.actionGridService.buildRequest(idData),
      actionData
    })
    .pipe(
      catchError(this.notificationsService.updateError().entity('entities.workTask.gen.plural').dispatchCallback())
    );
  }

  schedule(operationId: number, idData: IGridActionPayload, actionData: ICustomActionData): Observable<ICustomActionData> {
    return this.dataService.create('/asynch/mass/customOperation', {}, {
      operationId,
      idData: this.actionGridService.buildRequest(idData),
      actionData
    })
    .pipe(
      catchError(this.notificationsService.updateError().entity('entities.workTask.gen.plural').dispatchCallback())
    );
  }
}
