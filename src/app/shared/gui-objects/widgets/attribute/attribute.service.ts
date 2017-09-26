import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttributeResponse } from './attribute.interface';
import { IResponse } from '../../../../core/data/data.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  private errorMessage = 'entities.attribute.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<IAttributeResponse[]> {
    return this.dataService
      .read('/attributeTypes')
      .map((response: IResponse<IAttributeResponse[]>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }
}
