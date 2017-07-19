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
      return this.read()
        .map((response: IMetadataListsState) => {
          return {
            type: MetadataService.METADATA_FETCH_SUCCESS,
            payload: response
          };
        })
        .catch(() => {
          return [
            {
              type: MetadataService.METADATA_FETCH_FAILURE
            },
            this.notificationService.error('errors.default.read').entity('metadata.entity.plural').action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService
  ) {
  }

  private read(): Observable<IMetadataListsState> {
    return this.dataService.read('/list')
      .map((response: IMetadataResponse) => response.lists.reduce((acc, metadata) => {
        acc[metadata.name] = metadata.data;
        return acc;
      }, {}));
  }
}
