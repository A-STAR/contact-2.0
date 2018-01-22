import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IVisit } from './visits.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class VisitService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number, addressId: number, callCenter: boolean): Observable<IVisit[]> {
    return this.dataService
      .readAll('/persons/{personId}/addresses/{addressId}/visits', { personId, addressId }, { params: { callCenter }})
      .catch(this.notificationsService.fetchError().entity('entities.visit.gen.plural').dispatchCallback());
  }
}
