import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';

import {
  DynamicLayoutAction,
  IDynamicLayoutFetchConfigAction,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { NotificationsService } from '@app/core/notifications/notifications.service';
import { MetadataService } from '@app/shared/components/dynamic-layout/metadata.service';

@Injectable()
export class DynamicLayoutEffects {
  @Effect()
  fetchConfig$ = this.actions.pipe(
    ofType(DynamicLayoutAction.FETCH_CONFIG),
    switchMap(
      (action: IDynamicLayoutFetchConfigAction) => this.metadataService.fetchConfig(action.payload.key),
      (action: IDynamicLayoutFetchConfigAction, config: IDynamicLayoutConfig) => ({
        type: DynamicLayoutAction.FETCH_CONFIG_SUCCESS,
        payload: {
          key: action.payload.key,
          config: config
        },
      })
    ),
    catchError(this.notificationService
      .fetchError('shared.components.dynamic-layout.metadata.errors.fetch')
      .callback()
    ),
  );

  constructor(
    private actions: Actions,
    private notificationService: NotificationsService,
    private metadataService: MetadataService,
  ) { }
}
