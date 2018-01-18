import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { IDebt } from './workplaces.interface';
import { ITreeNode } from '../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../core/data/data.service';
import { NotificationsService } from '../../core/notifications/notifications.service';

import { toTreeNodes } from '../../core/utils/tree';

@Injectable()
export class WorkplacesService {
  private debts: { [key: number]: IDebt };

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  // TODO(d.maltsev): store debts cache for call center, contact registration and debtor card
  fetchDebtsForPerson(personId: number): Observable<IDebt[]> {
    return this.dataService
      .readAll('/persons/{personId}/debts', { personId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback())
      );
  }

  // TODO(d.maltsev): store debts cache for call center, contact registration and debtor card
  fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback()),
      );
  }

  fetchContactTree(debtId: number, contactType: number): Observable<ITreeNode[]> {
    return this.dataService
      .readAll('/debts/{debtId}/contactTypes/{contactType}/treeResults', { debtId, contactType })
      .pipe(
        map(toTreeNodes()),
        catchError(this.notificationsService.fetchError().entity('entities.contactTreeItems.gen.singular').dispatchCallback())
      );
  }

  fetchContactScenario(debtId: number, contactType: number, treeResultId: number): Observable<string> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/scenarios';
    return this.dataService
      .read(url, { debtId, contactType, treeResultId })
      .pipe(
        catchError(this.notificationsService.fetchError().entity('entities.scenarios.gen.singular').dispatchCallback()),
      );
  }
}
