import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEmployment } from './employment.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class EmploymentService {
  static MESSAGE_EMPLOYMENT_SAVED = 'MESSAGE_EMPLOYMENT_SAVED';

  private url = '/persons/{personId}/employments';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<IEmployment[]> {
    return this.dataService
      .read(this.url, { personId })
      .map(resp => resp.employments)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(personId: number, employmentId: number): Observable<IEmployment> {
    return this.dataService
      .read(`${this.url}/{employmentId}`, { personId, employmentId })
      .map(resp => resp.employments[0] || {})
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employment.gen.singular').dispatchCallback());
  }

  create(personId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .create(this.url, { personId }, employment)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.employment.gen.singular').dispatchCallback());
  }

  update(personId: number, employmentId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .update(`${this.url}/{employmentId}`, { personId, employmentId }, employment)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employment.gen.singular').dispatchCallback());
  }

  delete(personId: number, employmentId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{employmentId}`, { personId, employmentId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.employment.gen.singular').dispatchCallback());
  }
}
