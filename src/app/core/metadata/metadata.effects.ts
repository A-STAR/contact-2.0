import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IMetadataListsState, IMetadataResponse } from './metadata.interface';

import { DataService } from '../data/data.service';
import { MetadataService } from './metadata.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MetadataEffects {

  @Effect()
  fetchMetadata$ = this.actions
    .ofType(MetadataService.METADATA_FETCH)
    .switchMap((action: Action) => {
      return this.read(action.payload.key)
        .map(response => response.lists[0])
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

  private read(key: string): Observable<IMetadataResponse> {
    return this.dataService.read(`/list?name=${key}`);
  }
}
