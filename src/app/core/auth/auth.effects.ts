import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UnsafeAction } from '../../core/state/state.interface';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, throttleTime } from 'rxjs/operators';

import { IUserParams } from '@app/core/auth/auth.interface';

import { AuthService } from './auth.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOGIN),
    // Switching to a disposable stream
    // Errors on this stream don't affect outer stream
    // See https://stackoverflow.com/questions/41685519/ngrx-effects-error-handling/41685689
    switchMap((action: UnsafeAction) => of(action).pipe(
      switchMap(a => {
        const { login, password } = a.payload;
        return this.login(login, password);
      }),
      switchMap(token => [
        {
          type: AuthService.AUTH_CREATE_SESSION,
          payload: { token }
        },
        {
          type: AuthService.AUTH_LOGIN_SUCCESS
        }
      ]),
      catchError(error => {
        return [
          {
            type: AuthService.AUTH_DESTROY_SESSION,
            payload: { redirectToLogin: false }
          },
          this.notificationService.error('auth.errors.login').response(error).action(),
        ];
      }),
    )),
  );

  @Effect()
  refresh$ = this.actions.pipe(
    ofType(AuthService.AUTH_REFRESH),
    switchMap(action => of(action).pipe(
      switchMap(() => this.refresh()),
      map((token: string) => ({
        type: AuthService.AUTH_CREATE_SESSION,
        payload: { token, redirectAfterLogin: false }
      })),
      catchError(error => [
        {
          type: AuthService.AUTH_DESTROY_SESSION
        },
        this.notificationService.error('auth.errors.refresh').response(error).action(),
      ]),
    )),
  );

  @Effect()
  logout$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOGOUT),
    switchMap(action => of(action).pipe(
      switchMap(() => this.logout()),
      map(() => ({
        type: AuthService.AUTH_DESTROY_SESSION
      })),
      catchError(error => [
        {
          type: AuthService.AUTH_DESTROY_SESSION
        },
        this.notificationService.error('auth.errors.logout').response(error).action(),
      ]),
    )),
  );

  @Effect()
  retrieveToken$ = this.actions.pipe(
    ofType(AuthService.AUTH_RETRIEVE_TOKEN),
    switchMap((action: UnsafeAction) => {
      const { token } = action.payload;
      this.authService.initTokenTimer(token);
      return [];
    })
  );

  @Effect()
  createSession$ = this.actions.pipe(
    ofType(AuthService.AUTH_CREATE_SESSION),
    switchMap((action: UnsafeAction) => {
      const { token } = action.payload;
      this.authService.saveToken(token);
      this.authService.saveLanguage(token);
      this.authService.initTokenTimer(token);
      return [];
    }),
  );

  @Effect()
  destroySession$ = this.actions.pipe(
    ofType(AuthService.AUTH_DESTROY_SESSION),
    switchMap(() => {
      this.authService.removeToken();
      this.authService.clearTokenTimer();
      return [{ type: AuthService.AUTH_GLOBAL_RESET }];
    }),
  );

  @Effect()
  userParams$ = this.actions.pipe(
    ofType(AuthService.USER_FETCH),
    switchMap(() => {
      return this.fetchUserParams()
        .map(params => ({
          type: AuthService.USER_FETCH_SUCCESS,
          payload: { params }
        }))
        .catch(error => {
          return [
            this.notificationService.error('auth.errors.login').response(error).action(),
          ];
        });
    }),
  );

  @Effect()
  invalidToken$ = this.actions.pipe(
    ofType(AuthService.AUTH_TOKEN_INVALID),
    throttleTime(500),
    switchMap(() => {
      this.authService.removeToken();
      return [ this.notificationService.error('auth.errors.invalidToken').action() ];
    })
  );

  @Effect()
  init$ = defer(() => of({
    type: AuthService.AUTH_INIT,
  }));

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private get overrideRequestOptions(): any {
    return { observe: 'response', responseType: 'json' };
  }

  private login(login: string, password: string): Observable<string> {
    return this.dataService
      .post('/auth/login', {}, { login, password }, this.overrideRequestOptions)
      .pipe(
        map(response => this.getTokenFromResponse(response)),
      );
  }

  private refresh(): Observable<string> {
    return this.dataService
      .get('/api/refresh', {}, this.overrideRequestOptions)
      .pipe(
        map(response => this.getTokenFromResponse(response))
      );
  }

  private logout(): Observable<void> {
    return this.dataService.get('/auth/logout', {});
  }

  private getTokenFromResponse(response: HttpResponse<string>): string {
    return response.headers.get('X-AUTH-TOKEN');
  }

  private fetchUserParams(): Observable<IUserParams> {
    return this.dataService.read('/api/userParams');
  }
}
