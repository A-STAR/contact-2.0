import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ITreeNode } from '../../../../shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '../../../../core/data/data.service';

import { toTreeNodes } from '../../../../core/utils/tree';

@Injectable()
export class AttributesService {
  constructor(
    private dataService: DataService,
  ) {}

  fetchAll(debtId: number, contactType: number, treeResultId: number): Observable<ITreeNode[]> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/attributes';
    return this.dataService
      .readAll(url, { debtId, contactType, treeResultId })
      .map(toTreeNodes(true, true));
  }

  create(debtId: number, guid: string, attributes: any): Observable<any> {
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/attributes', { debtId, guid }, attributes);
  }
}
