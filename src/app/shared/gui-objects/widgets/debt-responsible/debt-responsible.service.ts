import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from '../operator/operator.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class DebtResponsibleService {
  static ACTION_DEBT_RESPONSIBLE_SET = 'debtSetResponsible';
  static ACTION_DEBT_RESPONSIBLE_CLEAR = 'debtClearResponsible';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSet$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'DEBT_RESPONSIBLE_SET', 'DEBT_RESPONSIBLE_RESET' ]);
  }

  get canClear$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_RESPONSIBLE_CLEAR');
  }

  setResponsible(debts: number[], operator: IOperator): Observable<any> {
    return this.dataService
      .create('/mass/debts/setResponsible', {}, { idData: debts, actionData: { userId: operator.id } })
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.plural').dispatchCallback());
  }

  clearResponsible(debts: number[]): Observable<any> {
    return this.dataService
      .create('/mass/debts/clearResponsible', {}, { idData: debts })
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.plural').dispatchCallback());
  }
}
