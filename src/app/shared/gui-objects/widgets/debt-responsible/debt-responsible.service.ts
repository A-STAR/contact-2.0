import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from '../operator/operator.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class DebtResponsibleService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSet$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'DEBT_RESPONSIBLE_SET', 'DEBT_RESPONSIBLE_RESET' ]);
  }

  setResponsible(operator: IOperator): Observable<any> {
    return this.dataService
      .create('mass/debts/setResponsible', {}, {})
      .catch(this.notificationsService.fetchError().entity('entities.opearator.gen.plural').dispatchCallback());
  }

  clearResponsible(): Observable<any> {
    return this.dataService
      .create('mass/debts/clearResponsible', {}, {})
      .catch(this.notificationsService.fetchError().entity('entities.opearator.gen.plural').dispatchCallback());
  }
}
