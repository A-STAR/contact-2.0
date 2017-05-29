import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { INotification, INotificationFilters, INotificationServiceState } from './notifications.interface';

@Injectable()
export class NotificationsService {

  constructor(private store: Store<IAppState>) {}

  /**
   * @deprecated
   *
   * @readonly
   * @type {Observable<INotificationFilters>}
   * @memberof NotificationsService
   */
  get filters(): Observable<INotificationFilters> {
    return this.store
      .select(state => state.notificationService.filters)
      // TODO: double check this:
      .filter(Boolean);
  }

  /**
   * @deprecated
   *
   * @readonly
   * @type {Observable<Array<INotification>>}
   * @memberof NotificationsService
   */
  get notifications(): Observable<Array<INotification>> {
    return this.store
      .select(state => state.notificationService.notifications)
      // TODO: double check this:
      .filter(Boolean);
  }

  get state(): Observable<INotificationServiceState> {
    return this.store
      .select(state => state.notificationService)
      // TODO: double check this:
      .filter(Boolean);
  }
}
