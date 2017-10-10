import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserTemplatesResponse } from './user-templates.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserTemplatesService } from './user-templates.service';

@Injectable()
export class UserTemplatesEffects {
  private url = '/lookup/templates/typeCode/{typeCode}/recipientsTypeCode/{recipientTypeCode}';

  @Effect()
  fetchDictionary$ = this.actions
    .ofType(UserTemplatesService.USER_TEMPLATES_FETCH)
    .mergeMap((action: Action) => {
      const { typeCode, recipientTypeCode } = action.payload;
      return this.read(typeCode, recipientTypeCode)
        .map(response => {
          return {
            type: UserTemplatesService.USER_TEMPLATES_FETCH_SUCCESS,
            payload: {
              typeCode,
              recipientTypeCode,
              templates: response.templates
            }
          };
        })
        .catch(error => {
          return [
            {
              type: UserTemplatesService.USER_TEMPLATES_FETCH_FAILURE,
              payload: {
                typeCode,
                recipientTypeCode,
              }
            },
            this.notificationService.fetchError().entity('entities.user.templates.gen.plural').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(typeCode: number, recipientTypeCode: number): Observable<IUserTemplatesResponse> {
    return this.dataService.read(this.url, { typeCode, recipientTypeCode });
  }
}
