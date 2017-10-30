import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDocument } from './document.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DocumentService {
  static MESSAGE_DOCUMENT_SAVED = 'MESSAGE_DOCUMENT_SAVED';
  private static BASE_URL = '/entityTypes/{entityType}/entities/{entityId}/fileattachments';

  private errSingular = 'entities.documents.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IDocument>> {
    return this.dataService
      .readAll(DocumentService.BASE_URL, { entityType, entityId })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.documents.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, documentId: number): Observable<IDocument> {
    return this.dataService
      .read(`${DocumentService.BASE_URL}/{documentId}`, { entityType, entityId, documentId })
      .catch(this.notificationsService.error('errors.default.read').entity(this.errSingular).dispatchCallback());
  }

  create(entityType: number, entityId: number, document: IDocument, file: File): Observable<void> {
    return this.dataService
      .createMultipart(DocumentService.BASE_URL, { entityType, entityId }, document, file)
      .catch(this.notificationsService.error('errors.default.create').entity(this.errSingular).dispatchCallback());
  }

  update(entityType: number, entityId: number, documentId: number, document: Partial<IDocument>, file: File): Observable<void> {
    return this.dataService
      .updateMultipart(`${DocumentService.BASE_URL}/{documentId}`, { entityType, entityId, documentId }, document, file)
      .catch(this.notificationsService.error('errors.default.update').entity(this.errSingular).dispatchCallback());
  }

  delete(entityType: number, entityId: number, documentId: number): Observable<void> {
    return this.dataService
      .delete(`${DocumentService.BASE_URL}/{documentId}`, { entityType, entityId, documentId })
      .catch(this.notificationsService.error('errors.default.delete').entity(this.errSingular).dispatchCallback());
  }
}
