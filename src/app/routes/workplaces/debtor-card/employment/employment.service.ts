import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { IAppState } from '@app/core/state/state.interface';
import { IEmployment } from './employment.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class EmploymentService extends AbstractActionService {
  static MESSAGE_EMPLOYMENT_SAVED = 'MESSAGE_EMPLOYMENT_SAVED';

  private url = '/persons/{personId}/employments';
  private errSingular = 'entities.employment.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(personId: number): Observable<IEmployment[]> {
    return this.dataService
      .readAll(this.url, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.employment.gen.plural').dispatchCallback());
  }

  fetch(personId: number, employmentId: number): Observable<IEmployment> {
    return this.dataService
      .read(`${this.url}/{employmentId}`, { personId, employmentId })
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(personId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .create(this.url, { personId }, employment)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  update(personId: number, employmentId: number, employment: IEmployment): Observable<any> {
    return this.dataService
      .update(`${this.url}/{employmentId}`, { personId, employmentId }, employment)
      .catch(this.notificationsService.updateError().entity(this.errSingular).dispatchCallback());
  }

  delete(personId: number, employmentId: number): Observable<any> {
    return this.dataService
      .delete(`${this.url}/{employmentId}`, { personId, employmentId })
      .catch(this.notificationsService.deleteError().entity(this.errSingular).dispatchCallback());
  }
}
