import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { INotification } from './notifications.interface';

@Injectable()
export class NotificationsService {

  constructor(private store: Store<IAppState>) {}

  get notifications(): Observable<Array<INotification>> {
    return this.store
      .select(state => state.notificationService.notifications)
      // TODO: double check this:
      .filter(Boolean);
  }
}
