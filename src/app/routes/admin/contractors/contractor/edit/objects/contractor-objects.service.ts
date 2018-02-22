import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IObject } from './contractor-objects.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from 'app/core/user/permissions/user-permissions.service';

@Injectable()
export class ContractorObjectsService {
  private baseUrl = '/contractors/{contractorId}/objects';
  private errorMessage = 'entities.object.gen.plural';

  constructor(
    private dataService: DataService,
    private userPermissionsService: UserPermissionsService,
    private notificationsService: NotificationsService,
  ) {}

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('OBJECT_CONTRACTOR_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('OBJECT_CONTRACTOR_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('OBJECT_CONTRACTOR_EDIT');
  }

  fetchAll(contractorId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .readAll(`${this.baseUrl}?typeCodes={typeCode}`, { contractorId, typeCode })
      .catch(this.notificationsService.fetchError().entity(this.errorMessage).dispatchCallback());
  }

  fetchNotAdded(contractorId: number, typeCode: number): Observable<IObject[]> {
    return this.dataService
      .readAll(`${this.baseUrl}/notadded?typeCodes={typeCode}`, { contractorId, typeCode })
      .catch(this.notificationsService.fetchError().entity(this.errorMessage).dispatchCallback());
  }

  add(contractorId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { contractorId }, { typeCode, objects: ids.map(id => ({ id, value: true })) })
      .catch(this.notificationsService.error('errors.default.add').entity(this.errorMessage).dispatchCallback());
  }

  delete(contractorId: number, typeCode: number, ids: number[]): Observable<void> {
    return this.dataService
      .update(this.baseUrl, { contractorId }, { typeCode, objects: ids.map(id => ({ id, value: false })) })
      .catch(this.notificationsService.deleteError().entity(this.errorMessage).dispatchCallback());
  }
}
