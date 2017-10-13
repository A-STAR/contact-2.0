import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttribute } from './attribute.interface';
import { IResponse } from '../../../../core/data/data.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  private baseUrl = '/attributeTypes';
  private errorMessage = 'entities.attribute.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<IAttribute[]> {
    return this.dataService
      .readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetch(attributeId: number): Observable<IAttribute> {
    return this.dataService
      .read(`${this.baseUrl}/{attributeId}`, { attributeId })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  create(attribute: Partial<IAttribute>): Observable<void> {
    return this.dataService
      .create(this.baseUrl, {}, attribute)
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  update(attributeId: number, attribute: Partial<IAttribute>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{attributeId}`, { attributeId }, attribute)
      .catch(this.notificationsService.updateError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(attributeId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{attributeId}`, { attributeId })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
