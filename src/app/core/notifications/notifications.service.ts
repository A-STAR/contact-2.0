import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { INotificationServiceState } from './notifications.interface';

@Injectable()
export class NotificationsService {
  static STORAGE_KEY = 'state/notifications';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<INotificationServiceState> {
    return this.store
      .select(state => state.notificationService)
      // TODO: separate service for persisting global state?
      .do(state => localStorage.setItem(NotificationsService.STORAGE_KEY, JSON.stringify(state)))
      // TODO: double check this:
      .filter(Boolean);
  }
}
