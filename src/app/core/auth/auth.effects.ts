import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UnsafeAction } from '../../core/state/state.interface';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions
    .ofType(AuthService.AUTH_LOGIN)
    .switchMap((action: UnsafeAction) => {
      const { login, password } = action.payload;
      return this.login(login, password)
        .map((token: string) => ({
          type: AuthService.AUTH_CREATE_SESSION,
          payload: { token }
        }))
        .catch(error => {
          return [
            {
              type: AuthService.AUTH_DESTROY_SESSION,
              payload: { redirectToLogin: false }
            },
            this.notificationService.error('auth.errors.login').response(error).action(),
          ];
        });
    });

  @Effect()
  refresh$ = this.actions
    .ofType(AuthService.AUTH_REFRESH)
    .switchMap((action: UnsafeAction) => {
      return this.refresh()
        .map((token: string) => ({
          type: AuthService.AUTH_CREATE_SESSION,
          payload: { token, redirectAfterLogin: false }
        }))
        .catch(error => [
          {
            type: AuthService.AUTH_DESTROY_SESSION
          },
          this.notificationService.error('auth.errors.refresh').response(error).action(),
        ]);
    });

  @Effect()
  logout$ = this.actions
    .ofType(AuthService.AUTH_LOGOUT)
    .switchMap((action: UnsafeAction) => {
      return this.logout()
        .map(() => ({
          type: AuthService.AUTH_DESTROY_SESSION
        }))
        .catch(error => [
          {
            type: AuthService.AUTH_DESTROY_SESSION
          },
          this.notificationService.error('auth.errors.logout').response(error).action(),
        ]);
    });

  @Effect()
  createSession$ = this.actions
    .ofType(AuthService.AUTH_CREATE_SESSION)
    .do((action: UnsafeAction) => {
      const { redirectAfterLogin, token } = action.payload;
      this.authService.saveToken(token);
      this.authService.saveLanguage(token);
      this.authService.initTokenTimer(token);
      if (redirectAfterLogin !== false) {
        this.authService.redirectAfterLogin();
      }
    })
    .switchMap(() => []);

  @Effect()
  destroySession$ = this.actions
    .ofType(AuthService.AUTH_DESTROY_SESSION)
    .do((action: UnsafeAction) => {
      this.authService.removeToken();
      this.authService.clearTokenTimer();
      if (!action.payload || action.payload.redirectToLogin !== false) {
        this.authService.redirectToLogin(action.payload ? action.payload.url : null);
      }
    })
    .switchMap(() => [
      {
        type: AuthService.AUTH_GLOBAL_RESET
      }
    ]);

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
    return this.dataService.post('/auth/login', {}, { login, password }, this.overrideRequestOptions)
      .map(response => this.getTokenFromResponse(response));
  }

  private refresh(): Observable<string> {
    return this.dataService.get('/api/refresh', {}, this.overrideRequestOptions)
      .map(response => this.getTokenFromResponse(response));
  }

  private logout(): Observable<void> {
    return this.dataService.get('/auth/logout', {});
  }

  private getTokenFromResponse(response: HttpResponse<string>): string {
    return response.headers.get('X-AUTH-TOKEN');
  }
}
