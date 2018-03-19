import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from 'angular2-toaster';
import { defer } from 'rxjs/observable/defer';

import { INotificationAction, NotificationTypeEnum } from './notifications.interface';

import { NotificationsService } from './notifications.service';
import { SettingsService } from '@app/core/settings/settings.service';


@Injectable()
export class NotificationsEffects {

  private toasterMessageTypes = {
    [NotificationTypeEnum.INFO]: 'info',
    [NotificationTypeEnum.WARNING]: 'warning',
    [NotificationTypeEnum.ERROR]: 'error',
    [NotificationTypeEnum.DEBUG]: 'error',
  };

  @Effect()
  init$ = defer(() =>
    this.settingsService.get(NotificationsService.STORAGE_KEY)
      .map(settings => ({ type: NotificationsService.NOTIFICATION_INIT, payload: settings }))
  );

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
    private settingsService: SettingsService
  ) {}
}
