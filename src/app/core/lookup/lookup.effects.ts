import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { ILookupKey } from './lookup.interface';

import { DataService } from '../data/data.service';
import { LookupService } from './lookup.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LookupEffects {
  @Effect()
  fetchCurrencies$ = this.actions
    .ofType(LookupService.LOOKUP_FETCH)
    .mergeMap((action: Action) => {
      const { key } = action.payload;
      return this.readData(key)
        .map(data => ({
          type: LookupService.LOOKUP_FETCH_SUCCESS,
          payload: { key, data }
        }))
        .catch(response => [
          { type: LookupService.LOOKUP_FETCH_FAILURE },
          this.notificationService.error('errors.default.read')
            .entity(`entities.lookup.${key}.gen.plural`).response(response).action(),
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private readData(key: ILookupKey): any {
    return this.dataService.readAll(`/lookup/${key}`);
  }
}
