import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationData } from './outcome.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { toTreeNodes } from '../../../../core/utils/tree';

@Injectable()
export class OutcomeService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  initRegistration(debtId: number, data: Partial<IContactRegistrationData>): Observable<string> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest111', { debtId }, data)
      .map(response => response.data[0].guid)
      .catch(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback());
  }

  fetchScenario(debtId: number, contactType: number, treeResultId: number): Observable<string> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/scenarios';
    return this.dataService
      .read(url, { debtId, contactType, treeResultId })
      .map(response => response.text)
      .catch(this.notificationsService.fetchError().entity('entities.scenarios.gen.plural').dispatchCallback());
  }

  fetchAutoComment(debtId: number, personId: number, personRole: number, templateId: number): Observable<string> {
    const url = '/debts/{debtId}/persons/{personId}/personRoles/{personRole}/templates/{templateId}';
    return this.dataService
      .read(url, { debtId, personId, personRole, templateId })
      .map(response => response.text)
      .catch(this.notificationsService.fetchError().entity('entities.autoComments.gen.singular').dispatchCallback());
  }

  fetchContactTree(debtId: number, contactType: number): Observable<ITreeNode[]> {
    return this.dataService
      .readAll('/debts/{debtId}/contactTypes/{contactType}/treeResults', { debtId, contactType })
      .map(toTreeNodes())
      .catch(this.notificationsService.fetchError().entity('entities.contactTreeItems.gen.singular').dispatchCallback());
  }
}
