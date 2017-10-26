import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IVisit } from './visits.interface';

import { DataService } from '../../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../../core/notifications/notifications.service';

@Injectable()
export class VisitService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number, addressId: number): Observable<IVisit[]> {
    return this.dataService
      .readAll('/persons/{personId}/addresses/{addressId}/visits', { personId, addressId })
      .catch(this.notificationsService.fetchError().entity('entities.visit.gen.plural').dispatchCallback());
  }
}
