import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';

import { IAppState } from '@app/core/state/state.interface';
import { IDocument } from './document.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DocumentService extends AbstractActionService {

  static MESSAGE_DOCUMENT_SAVED = 'MESSAGE_DOCUMENT_SAVED';

  private baseUrl = '/entityTypes/{entityType}/entities/{entityId}/fileattachments';

  private errPlural = 'entities.documents.gen.plural';
  private errSingular = 'entities.documents.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchForDebt(debtId: number, callCenter: boolean): Observable<Array<IDocument>> {
    const url = '/debts/{debtId}/fileattachments';
    return this.dataService
      .readAll(url, { debtId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity(this.errPlural).dispatchCallback()),
      );
  }

  fetchForPledgor(debtId: number, contractId: number, pledgorId: number, callCenter: boolean): Observable<Array<IDocument>> {
    const url = '/debts/{debtId}/pledgeContract/{contractId}/pledgor/{pledgorId}/fileattachments';
    return this.dataService
      .readAll(url, { debtId, contractId, pledgorId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity(this.errPlural).dispatchCallback()),
      );
  }

  fetchForGuarantor(debtId: number, contractId: number, guarantorId: number, callCenter: boolean): Observable<Array<IDocument>> {
    const url = '/debts/{debtId}/guaranteeContract/{contractId}/guarantor/{guarantorId}/fileattachments';
    return this.dataService
      .readAll(url, { debtId, contractId, guarantorId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity(this.errPlural).dispatchCallback()),
      );
  }

  fetchForEntity(entityType: number, entityId: number, callCenter: boolean): Observable<Array<IDocument>> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity(this.errPlural).dispatchCallback()),
      );
  }

  fetch(entityType: number, entityId: number, documentId: number, callCenter: boolean): Observable<IDocument> {
    return this.dataService
      .read(`${this.baseUrl}/{documentId}`, { entityType, entityId, documentId }, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback()),
      );
  }

  create(entityType: number, entityId: number, document: IDocument, file: File, callCenter: boolean): Observable<void> {
    const body = file ? { ...document, fileName: file.name } : document;
    return this.dataService
      .createMultipart(this.baseUrl, { entityType, entityId }, body, file, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.createError().entity(this.errSingular).dispatchCallback()),
      );
  }

  update(
    entityType: number,
    entityId: number,
    documentId: number,
    document: Partial<IDocument>,
    file: File,
    callCenter: boolean,
  ): Observable<void> {
    const data = { entityType, entityId, documentId };
    const body = file ? { ...document, fileName: file.name } : document;
    return this.dataService
      .updateMultipart(`${this.baseUrl}/{documentId}`, data, body, file, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback()),
      );
  }

  delete(entityType: number, entityId: number, documentId: number, callCenter: boolean): Observable<void> {
    const data = { entityType, entityId, documentId };
    return this.dataService
      .delete(`${this.baseUrl}/{documentId}`, data, { params: { callCenter } })
      .pipe(
        catchError(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback()),
      );
  }
}
