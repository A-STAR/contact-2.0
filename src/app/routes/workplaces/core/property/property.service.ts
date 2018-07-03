import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IProperty } from './property.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class PropertyService extends AbstractActionService {
  static MESSAGE_PROPERTY_SAVED = 'MESSAGE_PROPERTY_SAVED';
  static MESSAGE_PROPERTY_SELECTED = 'MESSAGE_PROPERTY_SELECTED';

  private baseUrl = '/persons/{personId}/property';
  private extUrl = `${this.baseUrl}/{propertyId}`;
  private entitySingular = 'entities.property.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  readonly canView$ = this.userPermissionsService.has('PROPERTY_VIEW');
  readonly canAdd$ = this.userPermissionsService.has('PROPERTY_ADD');
  readonly canEdit$ = this.userPermissionsService.has('PROPERTY_EDIT');
  readonly canDelete$ = this.userPermissionsService.has('PROPERTY_DELETE');

  fetchAll(personId: number): Observable<Array<IProperty>> {
    return this.dataService.readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.property.gen.plural').dispatchCallback());
  }

  fetch(personId: number, propertyId: number): Observable<IProperty> {
    return this.dataService.read(this.extUrl, { personId, propertyId })
      .catch(this.notificationsService.fetchError().entity(this.entitySingular).dispatchCallback());
  }

  create(personId: number, property: IProperty): Observable<IProperty> {
    return this.dataService
      .create(this.baseUrl, { personId }, property)
      .pipe(
        map(response => response.data[0] && response.data[0].id),
        catchError(this.notificationsService.createError().entity(this.entitySingular).dispatchCallback()),
      );
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
