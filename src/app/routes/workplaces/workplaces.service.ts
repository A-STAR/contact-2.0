import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { ITreeNode } from '../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../core/data/data.service';
import { NotificationsService } from '../../core/notifications/notifications.service';

import { toTreeNodes } from '../../core/utils/tree';

@Injectable()
export class WorkplacesService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

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
