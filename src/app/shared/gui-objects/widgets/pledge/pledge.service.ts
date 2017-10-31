import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPledgeContract } from './pledge.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class PledgeService {

  private baseUrl = '/debts/{debtId}/pledgeContract';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_ADD');
  }

  fetchAll(debtId: number): Observable<Array<IPledgeContract>> {
    return this.dataService.readAll(this.baseUrl, { debtId })
      .catch(this.notificationsService.fetchError().entity('entities.pledgeContract.gen.plural').dispatchCallback());
  }
}
