import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from '../operator/operator.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { IOperationResult } from './debt-responsible.interface';

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

  setResponsible(debts: number[], operator: IOperator): Observable<IOperationResult> {
    return this.dataService
      .create('/mass/debts/setResponsible', {}, { idData: { ids: debts }, actionData: { userId: operator.id } })
      .catch(this.notificationsService.error('errors.default.add').entity('entities.operator.gen.singular').dispatchCallback());
  }

  clearResponsible(debts: number[]): Observable<IOperationResult> {
    return this.dataService
      .create('/mass/debts/clearResponsible', {}, { idData: { ids: debts } })
      .catch(this.notificationsService.deleteError().entity('entities.operator.gen.singular').dispatchCallback());
  }

  showOperationNotification(result: IOperationResult): void {
    if (!result.success) {
      this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(result).dispatch();
    } else {
      this.notificationsService.info().entity('default.dialog.result.message').response(result).dispatch();
    }
  }
}
