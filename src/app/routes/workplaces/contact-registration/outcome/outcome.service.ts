import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactRegistrationData } from './outcome.interface';
import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../../core/data/data.service';

import { toTreeNodes } from '../../../../core/utils/tree';

@Injectable()
export class OutcomeService {
  constructor(
    private dataService: DataService,
  ) {}

  initRegistration(debtId: number, data: Partial<IContactRegistrationData>): Observable<string> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest', { debtId }, data)
      .map(response => response.data[0].guid);
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

  fetchContactTree(debtId: number, contactType: number): Observable<ITreeNode[]> {
    return this.dataService
      .readAll('/debts/{debtId}/contactTypes/{contactType}/treeResults', { debtId, contactType })
      .map(toTreeNodes());
  }
}
