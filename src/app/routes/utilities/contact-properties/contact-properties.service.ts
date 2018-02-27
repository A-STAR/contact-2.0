import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactTreeNode } from './contact-properties.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContactPropertyService {
  private baseUrl = '/contactTypes/{contactType}/treeTypes/{treeType}/results';
  private errorMessage = 'entities.contacts.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(contactType: number, treeType: number): Observable<IContactTreeNode[]> {
    return this.dataService
      .readAll(this.baseUrl, { contactType, treeType })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(contactType: number, treeType: number, resultId: number): Observable<IContactTreeNode> {
    return this.dataService
      .read(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(contactType: number, treeType: number, data: IContactTreeNode): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { contactType, treeType }, data)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(contactType: number, treeType: number, resultId: number, data: Partial<IContactTreeNode>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId }, data)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(contactType: number, treeType: number, resultId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  paste(contactType: number, treeType: number, resultId: number, parentId: number, copyAllChildren: boolean): Observable<void> {
    const data = {
      parentId,
      copyAllChildren: Number(copyAllChildren)
    };
    return this.dataService
      .create(`${this.baseUrl}/{resultId}/copy`, { contactType, treeType, resultId }, data)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
