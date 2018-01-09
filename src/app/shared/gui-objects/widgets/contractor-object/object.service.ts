import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IObject } from './object.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class ObjectService {
  private baseUrl = '/contractors/{contractorId}/objects';
  private errorMessage = 'entities.object.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  get canView$(): Observable<boolean> {
    // return this.userPermissionsService.has('OBJECT_CONTRACTOR_VIEW');
    return Observable.of(true);
  }

  get canAdd$(): Observable<boolean> {
    // return this.userPermissionsService.has('OBJECT_CONTRACTOR_EDIT');
    return Observable.of(true);
  }

  get canDelete$(): Observable<boolean> {
    // return this.userPermissionsService.has('OBJECT_CONTRACTOR_EDIT');
    return Observable.of(true);
  }

  fetchAll(contractorId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .readAll(`${this.baseUrl}?typeCodes={typeCode}`, { contractorId, typeCode })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  fetchNotAdded(contractorId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .readAll(`${this.baseUrl}/notadded?typeCodes={typeCode}`, { contractorId, typeCode })
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }

  create(contractorId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { contractorId }, { typeCode, objects: ids.map(id => ({ id, value: true })) })
      .catch(this.notificationsService.createError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }

  delete(contractorId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { contractorId }, { typeCode, objects: ids.map(id => ({ id, value: false })) })
      .catch(this.notificationsService.deleteError().entity(`${this.errorMessage}.singular`).dispatchCallback());
  }
}
