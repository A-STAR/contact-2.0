import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationData } from './outcome.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class OutcomeService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  initRegistration(debtId: number, data: Partial<IContactRegistrationData>): Observable<string> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest', { debtId }, data)
      .map(response => response.data[0].guid)
      .catch(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback());
  }

  fetchAutoComment(debtId: number, personId: number, personRole: number, templateId: number): Observable<string> {
    const url = '/debts/{debtId}/persons/{personId}/personRoles/{personRole}/templates/{templateId}';
    return this.dataService
      .read(url, { debtId, personId, personRole, templateId })
      .map(response => response.text)
      .catch(this.notificationsService.fetchError().entity('entities.autoComments.gen.singular').dispatchCallback());
  }
}
