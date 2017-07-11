import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ILookupRolesResponse, ILookupUsersResponse } from './lookup.interface';

import { DataService } from '../data/data.service';
import { LookupService } from './lookup.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LookupEffects {

  // TODO(d.maltsev): remove fake roles when lookup API is ready
  private fakeRoles = [
    { id: 1, name: 'Базовая-SuperAdmin#InitSuperAdmin' },
    { id: 2, name: 'Базовая-Empty#InitGuest' },
    { id: 3, name: 'Базовая-Empty#InitReadonly' }
  ];

  // TODO(d.maltsev): remove fake users when lookup API is ready
  private fakeUsers = [
    { id: 1, name: 'Иванов Иван Иванович' },
    { id: 2, name: 'Петров Петр Петрович' },
    { id: 3, name: 'Сидоров Сидор Сидорович' }
  ];

  @Effect()
  fetchRoles$ = this.actions
    .ofType(LookupService.LOOKUP_ROLES_FETCH)
    .switchMap((action: Action) => {
      return this.readLookupRoles()
        .map(response => ({
          type: LookupService.LOOKUP_ROLES_FETCH_SUCCESS,
          payload: {
            roles: response.roles
          }
        })
        )
        .catch(() => [
          {
            type: LookupService.LOOKUP_ROLES_FETCH_FAILURE
          },
          // TODO(d.maltsev): i18n
          this.notificationService.createErrorAction('lookup.roles.errors.fetch')
        ]);
    });

  @Effect()
  fetchUsers$ = this.actions
    .ofType(LookupService.LOOKUP_USERS_FETCH)
    .switchMap((action: Action) => {
      return this.readLookupUsers()
        .map(response => ({
          type: LookupService.LOOKUP_USERS_FETCH_SUCCESS,
          payload: {
            users: response.users
          }
        })
        )
        .catch(() => [
          {
            type: LookupService.LOOKUP_USERS_FETCH_FAILURE
          },
          // TODO(d.maltsev): i18n
          this.notificationService.createErrorAction('lookup.users.errors.fetch')
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private readLookupRoles(): Observable<ILookupRolesResponse> {
    // TODO(d.maltsev): remove fake response when lookup API is ready
    // return this.dataService.read('/lookup/roles');
    return Observable.of({ success: true, roles: this.fakeRoles }).take(1);
  }

  private readLookupUsers(): Observable<ILookupUsersResponse> {
    // TODO(d.maltsev): remove fake response when lookup API is ready
    // return this.dataService.read('/lookup/users');
    return Observable.of({ success: true, users: this.fakeUsers }).take(1);
  }
}
