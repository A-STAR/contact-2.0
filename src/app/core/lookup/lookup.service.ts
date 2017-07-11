import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../state/state.interface';
import { ILookupState, ILookupRole, ILookupUser } from './lookup.interface';
import { IOption } from '../converter/value/value-converter.interface';

import { ValueConverterService } from '../converter/value/value-converter.service';

@Injectable()
export class LookupService {
  static LOOKUP_ROLES_FETCH         = 'LOOKUP_ROLES_FETCH';
  static LOOKUP_ROLES_FETCH_SUCCESS = 'LOOKUP_ROLES_FETCH_SUCCESS';
  static LOOKUP_ROLES_FETCH_FAILURE = 'LOOKUP_ROLES_FETCH_FAILURE';
  static LOOKUP_USERS_FETCH         = 'LOOKUP_USERS_FETCH';
  static LOOKUP_USERS_FETCH_SUCCESS = 'LOOKUP_USERS_FETCH_SUCCESS';
  static LOOKUP_USERS_FETCH_FAILURE = 'LOOKUP_USERS_FETCH_FAILURE';

  constructor(
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {}

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.rolesResolved && state.usersResolved);
  }

  get roles(): Observable<Array<ILookupRole>> {
    return this.getRoles()
      .distinctUntilChanged();
  }

  get users(): Observable<Array<ILookupUser>> {
    return this.getUsers()
      .distinctUntilChanged();
  }

  get roleOptions(): Observable<Array<IOption>> {
    return this.getRoles()
      .map(roles => this.valueConverterService.valuesToOptions(roles))
      .distinctUntilChanged();
  }

  get userOptions(): Observable<Array<IOption>> {
    return this.getUsers()
      .map(users => this.valueConverterService.valuesToOptions(users))
      .distinctUntilChanged();
  }

  createRefreshRolesAction(): Action {
    return {
      type: LookupService.LOOKUP_ROLES_FETCH
    };
  }

  createRefreshUsersAction(): Action {
    return {
      type: LookupService.LOOKUP_USERS_FETCH
    };
  }

  refreshRoles(): void {
    const action = this.createRefreshRolesAction();
    this.store.dispatch(action);
  }

  refreshUsers(): void {
    const action = this.createRefreshUsersAction();
    this.store.dispatch(action);
  }

  private get state(): Observable<ILookupState> {
    return this.store.select(state => state.lookup);
  }

  private getRoles(): Observable<Array<ILookupRole>> {
    return this.state.map(state => state.roles);
  }

  private getUsers(): Observable<Array<ILookupUser>> {
    return this.state.map(state => state.users);
  }
}
