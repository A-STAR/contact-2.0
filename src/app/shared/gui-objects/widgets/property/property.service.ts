import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProperty } from './property.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class PropertyService {
  static MESSAGE_PROPERTY_SAVED = 'MESSAGE_PROPERTY_SAVED';

  private baseUrl = '/persons/{personId}/property';
  private extUrl = `${this.baseUrl}/{propertyId}`;
  private entitySingular = 'entities.property.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PROPERTY_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PROPERTY_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PROPERTY_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PROPERTY_DELETE');
  }

  fetchAll(personId: number): Observable<Array<IProperty>> {
    return this.dataService.readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.property.gen.plural').dispatchCallback());
  }

  fetch(personId: number, propertyId: number): Observable<IProperty> {
    return this.dataService.read(this.extUrl, { personId, propertyId })
      .catch(this.notificationsService.fetchError().entity(this.entitySingular).dispatchCallback());
  }

  create(personId: number, property: IProperty): Observable<IProperty> {
    return this.dataService.create(this.baseUrl, { personId }, property)
      .catch(this.notificationsService.createError().entity(this.entitySingular).dispatchCallback());
  }

  update(personId: number, propertyId: number, property: IProperty): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{propertyId}`, { personId, propertyId }, property)
      .catch(this.notificationsService.updateError().entity(this.entitySingular).dispatchCallback());
  }

  delete(personId: number, propertyId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{propertyId}`, { personId, propertyId })
      .catch(this.notificationsService.deleteError().entity(this.entitySingular).dispatchCallback());
  }
}
