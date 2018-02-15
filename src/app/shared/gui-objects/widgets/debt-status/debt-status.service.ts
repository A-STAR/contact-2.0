import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperationResult } from '../debt-responsible/debt-responsible.interface';
import { IDebtStatusChangeParams } from './debt-status.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtStatusService {

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  change(idData: IGridActionPayload, data: IDebtStatusChangeParams): Observable<IOperationResult> {
    return this.dataService
      .update('/mass/debts/statuschange', {},
        {
          idData: this.actionGridFilterService.buildRequest(idData),
          actionData: data
        }
      )
      .pipe(
        tap(response => {
          if (response.success) {
            this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
          } else {
            this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
          }
        }),
        catchError(this.notificationsService.updateError().entity('entities.attribute.gen.plural').dispatchCallback()));
  }

  getDebtsCount(actionData: IGridActionPayload): number | string {
    return this.actionGridFilterService.getSelectionCount(actionData) || '';
  }

}
