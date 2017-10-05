import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IObject } from './object.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ObjectService {
  private baseUrl = '/roles/{roleId}/objects';
  private errorMessage = 'entities.object.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(roleId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .read(`${this.baseUrl}?typeCodes={typeCode}`, { roleId, typeCode })
      .map(response => response.objectRoles)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetchNotAdded(roleId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .read(`${this.baseUrl}/notadded?typeCodes={typeCode}`, { roleId, typeCode })
      .map(response => response.objectRoles)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  create(roleId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { roleId }, { typeCode, objects: ids.map(id => ({ id, value: true })) })
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(roleId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { roleId }, { typeCode, objects: ids.map(id => ({ id, value: false })) })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
