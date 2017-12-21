import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IMessageTemplate } from './message-templates.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class MessageTemplatesService {
  static TYPE_PHONE_CALL = 1;
  static TYPE_SMS = 2;
  static TYPE_EMAIL = 3;
  static TYPE_AUTO_COMMENT = 4;
  static TYPE_CUSTOM = 5;

  private errorMessage = 'entities.messageTemplate.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(typeCode: number): Observable<Array<IMessageTemplate>> {
    return this.dataService
      .readAll('/templates?typeCodes={typeCode}', { typeCode })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(templateId: number): Observable<IMessageTemplate> {
    return this.dataService
      .read('/templates/{templateId}', { templateId })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(template: IMessageTemplate): Observable<void> {
    return this.dataService
      .create('/templates', {}, template)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(templateId: number, template: Partial<IMessageTemplate>): Observable<void> {
    return this.dataService
      .update('/templates/{templateId}', { templateId }, template)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(templateId: number): Observable<void> {
    return this.dataService
      .delete('/templates/{templateId}', { templateId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  fetchVariables(typeCode: number, recipientTypeCode: number): Observable<Array<any>> {
    return this.dataService
      .readAll('/templates/{typeCode}/recipients/{recipientTypeCode}/attributes', { typeCode, recipientTypeCode })
      .catch(this.notificationsService.fetchError().entity(`entities.attribute.gen.plural`).dispatchCallback());
  }
}
