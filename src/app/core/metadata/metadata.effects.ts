import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IMetadataResponse } from './metadata.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { DataService } from '../data/data.service';
import { MetadataService } from './metadata.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MetadataEffects {

  @Effect()
  fetchMetadata$ = this.actions
    .ofType(MetadataService.METADATA_FETCH)
    .mergeMap((action: UnsafeAction) => {
      return this.read(action.payload.key)
        .map(list => ({
          type: MetadataService.METADATA_FETCH_SUCCESS,
          payload: list
        }))
        .catch(error => {
          return [
            { type: MetadataService.METADATA_FETCH_FAILURE },
            this.notificationService.error('errors.default.read').entity('entities.metadata.gen.plural').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {}

  private read(key: string): Observable<IMetadataResponse[]> {
    return this.dataService.read(`/list?name=${key}`);
  }
}
