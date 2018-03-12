import * as R from 'ramda';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from 'angular2-toaster';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import { INotificationAction, NotificationTypeEnum } from './notifications.interface';

import { NotificationsService } from './notifications.service';

// TODO(a.tymchuk): take this to a separate service for persisting global state
const savedState = localStorage.getItem(NotificationsService.STORAGE_KEY);

@Injectable()
export class NotificationsEffects {

  private toasterMessageTypes = {
    [NotificationTypeEnum.INFO]: 'info',
    [NotificationTypeEnum.WARNING]: 'warning',
    [NotificationTypeEnum.ERROR]: 'error',
    [NotificationTypeEnum.DEBUG]: 'error',
  };

  @Effect()
  init$ = defer(() => of({
    type: NotificationsService.NOTIFICATION_INIT,
    payload: R.tryCatch(JSON.parse, () => ({}))(savedState || undefined)
  }));

  @Effect({ dispatch: false })
  notificationPush$ = this.actions
    .ofType(NotificationsService.NOTIFICATION_PUSH)
    .map((action: INotificationAction) => {
      const { message, showAlert, type } = action.payload.notification;
      if (showAlert) {
        this.toasterService.pop(this.toasterMessageTypes[type], message);
      }
    });

  constructor(
    private actions: Actions,
    private toasterService: ToasterService,
  ) {}
}
