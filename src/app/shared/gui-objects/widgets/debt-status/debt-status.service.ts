import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
      .catch(this.notificationsService.error('errors.default.update')
        .entity('entities.operator.gen.singular').dispatchCallback());
  }

}
