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
  private baseUrl = '/treeTypesCode/{treeTypeCode}/attributeTypes'

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(treeTypeCode: number): Observable<IAttributeResponse[]> {
    return this.dataService
      .read(this.baseUrl, { treeTypeCode })
      .map((response: IResponse<IAttributeResponse[]>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(treeTypeCode: number, attributeTypeId: number): Observable<IAttributeResponse> {
    return this.dataService
      .read(`${this.baseUrl}/{attributeTypeId}`, { treeTypeCode, attributeTypeId })
      .map((response: IResponse<IAttributeResponse>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(treeTypeCode: number, attribute: IAttributeResponse): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { treeTypeCode }, attribute)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(treeTypeCode: number, attributeTypeId: number, attribute: Partial<IAttributeResponse>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{attributeTypeId}`, { treeTypeCode, attributeTypeId }, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(treeTypeCode: number, attributeTypeId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{attributeTypeId}`, { treeTypeCode, attributeTypeId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
