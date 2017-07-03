import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IMetadataListsState, IMetadataResponse } from './metadata.interface';

import { MetadataService } from './metadata.service';
import { NotificationsService } from '../notifications/notifications.service';
import { GridService } from '../../shared/components/grid/grid.service';

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
            this.notificationService.createErrorAction('metadata.errors.fetch')
          ];
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationService: NotificationsService
  ) {
  }

  private read(): Observable<IMetadataListsState> {
    return this.gridService.read('/list')
      .map((response: IMetadataResponse) => response.lists.reduce((acc, metadata) => {
        acc[metadata.name] = metadata.data;
        return acc;
      }, {}));
  }
}
