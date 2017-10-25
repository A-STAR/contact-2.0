import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProperty } from './property.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PropertyService {
  static MESSAGE_PROPERTY_SAVED = 'MESSAGE_PROPERTY_SAVED';

  private baseUrl = '/persons/{personId}/property';
  private extUrl = `${this.baseUrl}/{propertyId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IProperty>> {
    return this.dataService.readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.property.gen.plural').dispatchCallback());
  }

  fetch(personId: number, propertyId: number): Observable<IProperty> {
    return this.dataService.read(this.extUrl, { personId, propertyId })
      .catch(this.notificationsService.error('errors.default.read').entity('entities.property.gen.singular').dispatchCallback());
  }

  create(personId: number, property: IProperty): Observable<IProperty> {
    return this.dataService.create(this.baseUrl, { personId }, property)
      .catch(this.notificationsService
        .error('errors.default.create')
        .entity('entities.property.gen.singular')
        .dispatchCallback()
      );
  }

  update(personId: number, propertyId: number, propertyItem: IProperty): Observable<any> {
    return this.dataService.update(this.extUrl, { personId, propertyId }, propertyItem)
      .catch(this.notificationsService
        .error('errors.default.update')
        .entity('entities.property.gen.singular')
        .dispatchCallback()
      );
  }
}
