import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IDocument } from './document.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DocumentService extends AbstractActionService {
  // TODO(d.maltsev): merge entity attributes service and entity translations service
  // and move entities there
  static ENTITY_CONTRACTOR = 13;
  static ENTITY_PORTFOLIO = 15;
  static ENTITY_PERSON = 18;
  static ENTITY_DEBT = 19;
  static ENTITY_PLEDGOR = 39;
  static ENTITY_GUARANTOR = 38;

  static MESSAGE_DOCUMENT_SAVED = 'MESSAGE_DOCUMENT_SAVED';
  private static BASE_URL = '/entityTypes/{entityType}/entities/{entityId}/fileattachments';

  private errSingular = 'entities.documents.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(entityType: number, entityId: number, callCenter: boolean): Observable<Array<IDocument>> {
    const url = this.getFetchUrl(entityType);
    return this.dataService
      .readAll(url, { entityId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.documents.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, documentId: number, callCenter: boolean): Observable<IDocument> {
    const url = this.getFetchUrl(entityType);
    return this.dataService
      .read(`${url}/{documentId}`, { entityId, documentId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(entityType: number, entityId: number, document: IDocument, file: File, callCenter: boolean): Observable<void> {
    const payload = { ...document, fileName: file.name };
    return this.dataService
      .createMultipart(DocumentService.BASE_URL, { entityType, entityId }, payload, file, { params: { callCenter } })
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(
    entityType: number,
    entityId: number,
    documentId: number,
    document: Partial<IDocument>,
    file: File,
    callCenter: boolean,
  ): Observable<void> {
    const payload = { ...document, fileName: file.name };
    const data = { entityType, entityId, documentId };
    return this.dataService
      .updateMultipart(`${DocumentService.BASE_URL}/{documentId}`, data, payload, file, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(entityType: number, entityId: number, documentId: number, callCenter: boolean): Observable<void> {
    const data = { entityType, entityId, documentId };
    return this.dataService
      .delete(`${DocumentService.BASE_URL}/{documentId}`, data, { params: { callCenter } })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }

  private getFetchUrl(entityType: number): string {
    switch (entityType) {
      case DocumentService.ENTITY_CONTRACTOR:
      case DocumentService.ENTITY_PORTFOLIO:
      case DocumentService.ENTITY_PERSON:
        return `/entityTypes/${entityType}/entities/{entityId}/fileattachments`;
      case DocumentService.ENTITY_DEBT:
        return '/debts/{entityId}/fileattachments';
      case DocumentService.ENTITY_GUARANTOR:
        return '/guarantors/{entityId}/fileattachments';
      case DocumentService.ENTITY_PLEDGOR:
        return '/pledgors/{entityId}/fileattachments';
    }
    throw new Error(`No fetch URL provided for entity type (${entityType})`);
  }
}
