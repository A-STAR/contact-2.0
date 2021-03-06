import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IUserTemplate } from './user-templates.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserTemplatesService } from './user-templates.service';

@Injectable()
export class UserTemplatesEffects {
  private url = '/lookup/templates/typeCode/{typeCode}/recipientsTypeCode/{recipientTypeCode}';

  @Effect()
  fetchDictionary$ = this.actions
    .ofType(UserTemplatesService.USER_TEMPLATES_FETCH)
    .mergeMap((action: UnsafeAction) => {
      const { typeCode, recipientTypeCode } = action.payload;
      return this.read(typeCode, recipientTypeCode)
        .map(templates => {
          return {
            type: UserTemplatesService.USER_TEMPLATES_FETCH_SUCCESS,
            payload: {
              typeCode,
              recipientTypeCode,
              templates
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

  private read(typeCode: number, recipientTypeCode: number): Observable<IUserTemplate[]> {
    return this.dataService.readAll(this.url, { typeCode, recipientTypeCode });
  }
}
