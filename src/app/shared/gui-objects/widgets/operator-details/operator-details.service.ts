import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IOperator } from './operator-details.interface';

// import { DataService } from '../../../../core/data/data.service';
// import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class OperatorDetailsService {

  constructor(
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {}

  fetch(userId: number): Observable<IOperator> {
    // return this.dataService.read('/users/{userId}/gridDetail', { userId })
      // .catch(this.notificationsService.fetchError().entity('entities.operator.gen.singular').dispatchCallback());
    return Observable.of({
      userId: 1,
      fullName: 'fullName',
      isInactive: false,
      organization: 'organization',
      position: 'position',
      email: 'email',
      mobPhone: 'mobPhone',
      workPhone: 'workPhone',
      intPhone: 'intPhone',
      roleCode: 1
    });
  }
}
