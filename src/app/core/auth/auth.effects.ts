import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
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
    .switchMap((action: Action) => {
      const { login, password } = action.payload;
      return this.login(login, password)
        .map((token: string) => ({
          type: AuthService.AUTH_CREATE_SESSION,
          payload: { token }
        }))
        .catch(error => {
          const code = error instanceof Response ? error.json().message.code : null;
          const message = code ? `auth.errors.${code}` : 'auth.errors.login';
          return [
            {
              type: AuthService.AUTH_DESTROY_SESSION,
              payload: { redirectToLogin: false }
            },
            this.notificationService.createErrorAction(message),
          ];
        });
    });

  @Effect()
  refresh$ = this.actions
    .ofType(AuthService.AUTH_REFRESH)
    .switchMap((action: Action) => {
      return this.refresh()
        .map((token: string) => ({
          type: AuthService.AUTH_CREATE_SESSION,
          payload: { token, redirectAfterLogin: false }
        }))
        .catch(() => [
          {
            type: AuthService.AUTH_DESTROY_SESSION
          },
          this.notificationService.createErrorAction('auth.errors.refresh'),
        ]);
    });

  @Effect()
  logout$ = this.actions
    .ofType(AuthService.AUTH_LOGOUT)
    .switchMap((action: Action) => {
      return this.logout()
        .map(() => ({
          type: AuthService.AUTH_DESTROY_SESSION
        }))
        .catch(() => [
          {
            type: AuthService.AUTH_DESTROY_SESSION
          },
          this.notificationService.createErrorAction('auth.errors.logout')
        ]);
    });

  @Effect()
  createSession$ = this.actions
    .ofType(AuthService.AUTH_CREATE_SESSION)
    .do((action: Action) => {
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
    .do((action: Action) => {
      this.authService.removeToken();
      this.authService.clearTokenTimer();
      if (!action.payload || action.payload.redirectToLogin !== false) {
        this.authService.redirectToLogin();
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

  private login(login: string, password: string): Observable<string> {
    return this.dataService.post('/auth/login', {}, { login, password })
      .map(response => this.getTokenFromResponse(response));
  }

  private refresh(): Observable<string> {
    return this.dataService.get('/api/refresh', {}, {})
      .map(response => this.getTokenFromResponse(response));
  }

  private logout(): Observable<void> {
    return this.dataService.get('/auth/logout', {});
  }

  private getTokenFromResponse(response: Response): string {
    return response.headers.get('X-Auth-Token');
  }
}
