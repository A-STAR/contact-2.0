import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ILookupLanguagesResponse, ILookupRolesResponse, ILookupUsersResponse } from './lookup.interface';

import { DataService } from '../data/data.service';
import { LookupService } from './lookup.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LookupEffects {
  @Effect()
  fetchLanguages$ = this.actions
    .ofType(LookupService.LOOKUP_LANGUAGES_FETCH)
    .mergeMap((action: Action) => {
      return this.readLookupLanguages()
        .map(response => ({
          type: LookupService.LOOKUP_LANGUAGES_FETCH_SUCCESS,
          payload: { languages: response.languages }
        }))
        .catch(this.notificationService.error('errors.default.read').entity('entities.lookup.languages.gen.plural').callback());
    });

  @Effect()
  fetchRoles$ = this.actions
    .ofType(LookupService.LOOKUP_ROLES_FETCH)
    .mergeMap((action: Action) => {
      return this.readLookupRoles()
        .map(response => ({
          type: LookupService.LOOKUP_ROLES_FETCH_SUCCESS,
          payload: { roles: response.roles }
        }))
        .catch(this.notificationService.error('errors.default.read').entity('entities.lookup.roles.gen.plural').callback());
    });

  @Effect()
  fetchUsers$ = this.actions
    .ofType(LookupService.LOOKUP_USERS_FETCH)
    .mergeMap((action: Action) => {
      return this.readLookupUsers()
        .map(response => ({
          type: LookupService.LOOKUP_USERS_FETCH_SUCCESS,
          payload: { users: response.users }
        }))
        .catch(this.notificationService.error('errors.default.read').entity('entities.lookup.users.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private readLookupLanguages(): Observable<ILookupLanguagesResponse> {
    return this.dataService.read('/lookup/languages');
  }

  private readLookupRoles(): Observable<ILookupRolesResponse> {
    return this.dataService.read('/lookup/roles');
  }

  private readLookupUsers(): Observable<ILookupUsersResponse> {
    return this.dataService.read('/lookup/users');
  }
}
