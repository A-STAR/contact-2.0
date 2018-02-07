import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  IDashboardParams,
  IDashboardPromiseAmount,
  IDashboardPromiseCount,
  IDashboardPromiseCountStatus,
  IDashboardPromiseCoverage,
  IDashboardContactsDay,
} from '@app/routes/dashboard/dashboard.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DashboardService {

  private baseUrl = '/dashboard';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  getParams(): Observable<IDashboardParams> {
    return this.dataService.read(`${this.baseUrl}/params`)
      .catch(this.notificationsService.fetchError('dashboard.errors.params').dispatchCallback());
  }

  getPromiseAmount(): Observable<IDashboardPromiseAmount> {
    return this.dataService.read(`${this.baseUrl}/promiseAmount`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseAmount').dispatchCallback());
  }

  getPromiseCount(): Observable<IDashboardPromiseCount> {
    return this.dataService.read(`${this.baseUrl}/promiseCount`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCount').dispatchCallback());
  }

  getPromiseCountStatus(): Observable<IDashboardPromiseCountStatus> {
    return this.dataService.read(`${this.baseUrl}/promiseCountStatus`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCountStatus').dispatchCallback());
  }

  getPromiseCover(): Observable<IDashboardPromiseCoverage> {
    return this.dataService.read(`${this.baseUrl}/promiseCover`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCover').dispatchCallback());
  }

  getContactsDay(): Observable<IDashboardContactsDay> {
    return this.dataService.read(`${this.baseUrl}/contactDay`)
      .catch(this.notificationsService.fetchError('dashboard.errors.contactDay').dispatchCallback());
  }

}
