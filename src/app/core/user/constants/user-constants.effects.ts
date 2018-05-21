import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, switchMap, map } from 'rxjs/operators';

import { IUserConstant } from './user-constants.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsEffects {
  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserConstantsService.USER_CONSTANTS_FETCH)
    .pipe(
      switchMap(() => {
        return this.authService.isRetrievedTokenValid()
          ? this.read().pipe(
              map((constants: IUserConstant[]) => ({
                type: UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS,
                payload: {
                  data: constants.reduce((acc, constant) => ({ ...acc, [constant.name]: constant }), {})
                },
              })),
              catchError(this.notificationService.fetchError().entity('entities.user.constants.gen.plural').callback()),
          )
          : of({ type: 'FETCHING_USER_CONSTANTS_WHEN_NOT_AUTHORIZED' });
      })
    );

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) { }

  private read(): Observable<IUserConstant[]> {
    return this.dataService.readAll('/constants/values');
  }
}
