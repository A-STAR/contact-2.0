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
  private baseUrl = '/attributeTypes'

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<IAttributeResponse[]> {
    return this.dataService
      .read(this.baseUrl)
      .map((response: IResponse<IAttributeResponse[]>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(attributeTypeId: number): Observable<IAttributeResponse> {
    return this.dataService
      .read(`${this.baseUrl}/{attributeTypeId}`, { attributeTypeId })
      .map((response: IResponse<IAttributeResponse>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(attribute: IAttributeResponse): Observable<void> {
    return this.dataService
      .create(this.baseUrl, {}, attribute)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(attributeTypeId: number, attribute: Partial<IAttributeResponse>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{attributeTypeId}`, { attributeTypeId }, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(attributeTypeId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{attributeTypeId}`, { attributeTypeId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
