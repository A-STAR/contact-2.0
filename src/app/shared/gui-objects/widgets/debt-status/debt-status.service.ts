import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { IOperationResult } from '../debt-responsible/debt-responsible.interface';
import { IDebtStatusChangeParams } from './debt-status.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtStatusService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  change(debts: number[], data: IDebtStatusChangeParams): Observable<IOperationResult> {
    const ids = debts.map(debtId => [ debtId ]);
    return this.dataService
      .update('/mass/debts/statuschange', {}, { idData: { ids }, actionData: data })
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

}
