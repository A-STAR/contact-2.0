import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserAttributeType } from './user-attribute-types.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserAttributeTypesService } from './user-attribute-types.service';

@Injectable()
export class UserAttributeTypesEffects {
  private url = '/lookup/entityTypes/{entityTypeId}/entitySubtypes/{entitySubtypeCode}/attributeTypes';

  @Effect()
  fetchUserAttributeTypes$ = this.actions
    .ofType(UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH)
    .mergeMap((action: UnsafeAction) => {
      const { entityTypeId, entitySubtypeCode } = action.payload;
      return this.read(entityTypeId, entitySubtypeCode)
        .map(attributeTypes => {
          return {
            type: UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_SUCCESS,
            payload: {
              entityTypeId,
              entitySubtypeCode,
              attributeTypes
            }
          };
        })
        .catch(error => {
          return [
            {
              type: UserAttributeTypesService.USER_ATTRIBUTE_TYPES_FETCH_FAILURE,
              payload: {
                entityTypeId,
                entitySubtypeCode,
              }
            },
            this.notificationService.fetchError().entity('entities.user.attributeType.gen.plural').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(entityTypeId: number, entitySubtypeCode: number): Observable<IUserAttributeType[]> {
    return this.dataService.readAll(this.url, { entityTypeId, entitySubtypeCode });
  }
}
