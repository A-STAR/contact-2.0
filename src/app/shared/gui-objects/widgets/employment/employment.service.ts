import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmployment } from './employment.interface';

// import { DataService } from '../../../../core/data/data.service';
// import { NotificationsService } from '../../../../core/notifications/notifications.service';

const records = [
  {
    id: 1,
    workTypeCode: 1,
    company: 'Microsoft',
    position: 'Delivery Manager',
    hireDate: new Date('2014-06-01'),
    dismissDate: new Date('2017-03-04'),
    income: 120000,
    currencyId: 1,
    comment: 'High flyer position, Level 3',
  },
  {
    id: 2,
    workTypeCode: 2,
    company: 'Oracle',
    position: 'Backend Team Lead',
    hireDate: new Date('2014-03-01'),
    dismissDate: new Date('2017-01-19'),
    income: 120000,
    currencyId: 1,
    comment: 'Middleman',
  },
];

@Injectable()
export class EmploymentService {
  static MESSAGE_EMPLOYMENT_SAVED = 'MESSAGE_EMPLOYMENT_SAVED';

  constructor(
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<IEmployment[]> {
    return Observable.of(records);
    // return this.dataService
    //   .read('/persons/{personId}/debts', { personId })
    //   .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, employmentId: number): Observable<IEmployment> {
    return Observable.of(records[0]);
    // return this.dataService
    //   .read('/debts/{employmentId}', { personId, employmentId })
    //   .catch(this.notificationsService.error('errors.default.read').entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, employment: IEmployment): Observable<void> {
    return Observable.of(null);
  }

  update(personId: number, employmentId: number, employment: IEmployment): Observable<void> {
    return Observable.of(null);
  }
}
