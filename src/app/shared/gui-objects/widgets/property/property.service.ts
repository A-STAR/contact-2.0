import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProperty } from './property.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PropertyService {
  static PROPERTY_SAVED = 'MESSAGE_SAVED';

  baseUrl = '/persons/{personId}/property';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IProperty>> {
    return this.dataService.readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.property.gen.plural').dispatchCallback());
  }

  create(personId: number, property: IProperty): Observable<IProperty> {
    return this.dataService.create(this.baseUrl, { personId }, property)
      .catch(this.notificationsService
        .error('errors.default.create')
        .entity('entities.property.gen.singular')
        .dispatchCallback()
      );
  }
}
