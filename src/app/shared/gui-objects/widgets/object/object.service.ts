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
}
