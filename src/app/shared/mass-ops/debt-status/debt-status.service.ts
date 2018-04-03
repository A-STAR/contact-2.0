import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperationResult } from '../debt-responsible/debt-responsible.interface';
import { IDebtStatusChangeParams } from './debt-status.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DebtStatusService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  change(idData: IGridActionPayload, data: IDebtStatusChangeParams): Observable<IOperationResult> {
    return this.dataService
      .update('/mass/debts/statuschange', {},
        {
          idData: this.actionGridService.buildRequest(idData),
          actionData: data
        }
      )
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationsService.info('system.notifications.tasks.start.success').response(response).dispatch();
          } else {
            this.notificationsService.warning('system.notifications.tasks.start.error').response(response).dispatch();
          }
        }),
        catchError(this.notificationsService.updateError().entity('entities.attribute.gen.plural').dispatchCallback()));
  }

  getDebtsCount(actionData: IGridActionPayload): number | string {
    return this.actionGridService.getSelectionCount(actionData) || '';
  }

}
