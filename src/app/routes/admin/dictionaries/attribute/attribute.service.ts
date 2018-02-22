import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttribute } from './attribute.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  private baseUrl = '/entityTypes/{entityTypeId}/entitySubtypes/{entitySubtypeCode}/attributeTypes';
  private errorMessage = 'entities.attribute.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityTypeId: number, entitySubtypeCode: number): Observable<IAttribute[]> {
    const params = { entityTypeId, entitySubtypeCode: entitySubtypeCode || 0 };
    return this.dataService
      .readAll(this.baseUrl, params)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(entityTypeId: number, entitySubtypeCode: number, attributeId: number): Observable<IAttribute> {
    const params = { entityTypeId, entitySubtypeCode: entitySubtypeCode || 0, attributeId };
    return this.dataService
      .read(`${this.baseUrl}/{attributeId}`, params)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(entityTypeId: number, entitySubtypeCode: number, attribute: Partial<IAttribute>): Observable<void> {
    const params = { entityTypeId, entitySubtypeCode: entitySubtypeCode || 0 };
    return this.dataService
      .create(this.baseUrl, params, attribute)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(entityTypeId: number, entitySubtypeCode: number, attributeId: number, attribute: Partial<IAttribute>): Observable<void> {
    const params = { entityTypeId, entitySubtypeCode: entitySubtypeCode || 0, attributeId };
    return this.dataService
      .update(`${this.baseUrl}/{attributeId}`, params, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(entityTypeId: number, entitySubtypeCode: number, attributeId: number): Observable<void> {
    const params = { entityTypeId, entitySubtypeCode: entitySubtypeCode || 0, attributeId };
    return this.dataService
      .delete(`${this.baseUrl}/{attributeId}`, params)
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
