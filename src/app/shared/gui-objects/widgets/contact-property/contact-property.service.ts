import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactTreeNode } from './contact-property.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { valuesToOptions } from '../../../../core/utils';

@Injectable()
export class ContactPropertyService {
  private baseUrl = '/contactTypes/{contactType}/treeTypes/{treeType}/results';
  private errorMessage = 'entities.contact.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(contactType: number, treeType: number): Observable<IContactTreeNode[]> {
    return this.dataService
      .read(this.baseUrl, { contactType, treeType })
      .map(response => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(contactType: number, treeType: number, resultId: number): Observable<IContactTreeNode> {
    return this.dataService
      .read(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId })
      .map(response => response.data[0])
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  fetchTemplatesAsOptions(typeCode: number, recipientTypeCode: number, isSentOnce: boolean): Observable<IOption[]> {
    const url = '/lookup/templates/typeCode/{typeCode}/recipientsTypeCode/{recipientTypeCode}?isSingleSending={isSentOnce}';
    return this.dataService
      .read(url, { typeCode, recipientTypeCode, isSentOnce: Number(isSentOnce) })
      .map(response => response.templates)
      .map(valuesToOptions);
  }

  create(contactType: number, treeType: number, data: IContactTreeNode): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { contactType, treeType }, data)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(contactType: number, treeType: number, resultId: number, data: IContactTreeNode): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId }, data)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(contactType: number, treeType: number, resultId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{resultId}`, { contactType, treeType, resultId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
