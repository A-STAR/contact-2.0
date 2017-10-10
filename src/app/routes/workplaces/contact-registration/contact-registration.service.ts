import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContactTreeNode } from '../../../shared/gui-objects/widgets/contact-property/contact-property.interface';
import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../core/data/data.service';
// import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ContactRegistrationService {
  constructor(
    private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {}

  selectedNode$ = new BehaviorSubject<ITreeNode>(null);

  fetchAttributes(debtId: number, contactType: number, treeResultId: number): Observable<any[]> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/attributes';
    return this.dataService
      .read(url, { debtId, contactType, treeResultId })
      .map(response => response.data);
  }

  fetchScenario(debtId: number, contactType: number, treeResultId: number): Observable<string> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/scenarios';
    return this.dataService
      .read(url, { debtId, contactType, treeResultId })
      .map(response => response.text);
  }

  fetchAutoComment(debtId: number, personId: number, personRole: number, templateId: number): Observable<string> {
    const url = '/debts/{debtId}/persons/{personId}/personRoles/{personRole}/templates/{templateId}';
    return this.dataService
      .read(url, { debtId, personId, personRole, templateId })
      .map(response => response.text);
  }

  fetchContactTree(debtId: number, contactType: number): Observable<IContactTreeNode[]> {
    return this.dataService
      .read('/debts/{debtId}/contactTypes/{contactType}/treeResults', { debtId, contactType })
      .map(response => response.data);
  }
}
