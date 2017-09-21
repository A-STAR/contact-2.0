import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttributeResponse } from './attribute.interface';
import { IResponse } from '../../../../core/data/data.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  static MESSAGE_ATTRIBUTE_SAVED = 'MESSAGE_ATTRIBUTE_SAVED';

  private errorMessage = 'entities.attribute.gen';
  private baseUrl = '/entityTypes/{entityType}/entities/{entityId}/attributes'

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<IAttributeResponse[]> {
    return this.dataService
      .read(this.baseUrl, { entityType, entityId })
      .map((response: IResponse<IAttributeResponse[]>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(entityType: number, entityId: number, attributeCode: number): Observable<IAttributeResponse> {
    return this.dataService
      .read(`${this.baseUrl}Code/{attributeCode}`, { entityType, entityId, attributeCode })
      .map((response: IResponse<IAttributeResponse>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(entityType: number, entityId: number, attributeCode: number, attribute: Partial<IAttributeResponse>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}Code/{attributeCode}`, { entityType, entityId, attributeCode }, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
