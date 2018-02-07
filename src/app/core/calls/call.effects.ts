import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ICallSettings } from './call.interface';

import { CallService } from './call.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CallEffects {

  @Effect()
  fetchCallSettings$ = this.actions
    .ofType(CallService.CALL_SETTINGS_FETCH)
    .mergeMap(() => {
      return this.read()
        .map(settings => ({
          type: CallService.CALL_SETTINGS_FETCH_SUCCESS,
          payload: settings
        }))
        .catch(error => {
          return [
            { type: CallService.CALL_SETTINGS_FETCH_FAILURE },
            this.notificationService.fetchError().entity('entities.callSettings.gen.plural').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {}

  private read(): Observable<ICallSettings> {
    return this.dataService.read('/pbx/settings');
  }
}
