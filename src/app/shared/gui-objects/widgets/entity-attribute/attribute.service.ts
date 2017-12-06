import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttribute, IAttributeVersion } from './attribute.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  static MESSAGE_ATTRIBUTE_SAVED = 'MESSAGE_ATTRIBUTE_SAVED';

  private errorMessage = 'entities.attribute.gen';
  private baseUrl = '/entityTypes/{entityType}/entities/{entityId}/attributes';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<IAttribute[]> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(entityType: number, entityId: number, attributeCode: number): Observable<IAttribute> {
    return this.dataService
      .read(`${this.baseUrl}Code/{attributeCode}`, { entityType, entityId, attributeCode })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(entityType: number, entityId: number, attributeCode: number, attribute: Partial<IAttribute>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}Code/{attributeCode}`, { entityType, entityId, attributeCode }, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  fetchAllVersions(entityType: number, entityId: number, attributeCode: number): Observable<IAttributeVersion[]> {
    return this.dataService
    .read(`${this.baseUrl}Code/{attributeCode}/versions`, { entityType, entityId, attributeCode })
    .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
