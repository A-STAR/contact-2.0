import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IMessageTemplate, IMessageTemplatesResponse } from './message-template.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class MessageTemplateService {
  private errorMessage = 'entities.messageTemplate.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(typeCode: number): Observable<Array<IMessageTemplate>> {
    return this.dataService
      .read('/templates?typeCodes={typeCode}', { typeCode })
      .map((response: IMessageTemplatesResponse) => response.templates)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(templateId: number): Observable<IMessageTemplate> {
    return this.dataService
      .read('/templates/{templateId}', { templateId })
      .map((response: IMessageTemplatesResponse) => response.templates[0])
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
}
