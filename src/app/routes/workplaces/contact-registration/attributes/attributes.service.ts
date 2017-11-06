import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { toTreeNodes } from '../../../../core/utils/tree';

@Injectable()
export class AttributesService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number, contactType: number, treeResultId: number): Observable<ITreeNode[]> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/attributes';
    return this.dataService
      .readAll(url, { debtId, contactType, treeResultId })
      .map(toTreeNodes(true, true))
      .catch(this.notificationsService.fetchError().entity('entities.attributes.gen.plural').dispatchCallback());
  }

  create(debtId: number, guid: string, attributes: any): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/attributes', { debtId, guid }, attributes)
      .catch(this.notificationsService.createError().entity('entities.attributes.gen.singular').dispatchCallback());
  }
}
