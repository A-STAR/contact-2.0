import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactTreeNode } from './contact-property.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ContactPropertyService {
  private baseUrl = '/contactTypes/{contactType}/treeTypes/{treeType}/results';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(contactType: number, treeType: number): Observable<IContactTreeNode[]> {
    return this.dataService
      .read(this.baseUrl, { contactType, treeType })
      .map(response => response.data)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.contact.gen.plural').dispatchCallback());
  }

  // TODO(d.maltsev): move to lookup service
  fetchAttributeTypes(): Observable<any[]> {
    const url = '/lookup/attributeTypes';
    return this.dataService
      .read(url)
      .map(response => response.data);
  }

  // TODO(d.maltsev): move to lookup service
  fetchTemplates(typeCode: number, recipientTypeCode: number, isSentOnce: boolean): Observable<any[]> {
    const url = '/lookup/templates/typeCode/{typeCode}/recipientsTypeCode/{recipientTypeCode}?isSingleSending={isSentOnce}';
    return this.dataService
      .read(url, { typeCode, recipientTypeCode, isSentOnce: Number(isSentOnce) })
      .map(response => response.templates);
  }
}
