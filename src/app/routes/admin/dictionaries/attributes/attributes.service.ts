import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IResponse } from '../../../../core/data/data.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AttributesService {
  private errorMessage = 'entities.attribute.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<any[]> {
    return this.dataService
      .read('/attributeTypes')
      .map((response: IResponse<any>) => response.data)
      .catch(this.notificationsService.fetchError().entity(`${this.errorMessage}.plural`).dispatchCallback());
  }
}
