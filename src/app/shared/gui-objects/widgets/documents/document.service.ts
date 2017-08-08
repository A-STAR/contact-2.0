import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDocument, IDocumentsResponse } from './document.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DocumentService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IDocument>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/documents', { entityType, entityId })
      .map((response: IDocumentsResponse) => response.documents)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.documents.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, documentId: number): Observable<IDocument> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/documents/{documentId}', { entityType, entityId, documentId })
      .map((response: IDocumentsResponse) => response.documents[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.documents.gen.singular').dispatchCallback());
  }

  create(entityType: number, entityId: number, document: IDocument): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/documents/', { entityType, entityId }, document)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.documents.gen.singular').dispatchCallback());
  }

  update(entityType: number, entityId: number, documentId: number, document: Partial<IDocument>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/documents/{documentId}', { entityType, entityId, documentId }, document)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.documents.gen.singular').dispatchCallback());
  }

  block(entityType: number, entityId: number, documentId: number): Observable<void> {
    return this.update(entityType, entityId, documentId, { isBlocked: 1 });
  }

  unblock(entityType: number, entityId: number, documentId: number): Observable<void> {
    return this.update(entityType, entityId, documentId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, documentId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/documents/{documentId}', { entityType, entityId, documentId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.documents.gen.singular').dispatchCallback());
  }
}
