import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../state/state.interface';
import { ILookupState, ILookupLanguage, ILookupRole, ILookupUser } from './lookup.interface';
import { IOption } from '../converter/value-converter.interface';

import { ValueConverterService } from '../converter/value-converter.service';

@Injectable()
export class LookupService {
  static LOOKUP_LANGUAGES_FETCH         = 'LOOKUP_LANGUAGES_FETCH';
  static LOOKUP_LANGUAGES_FETCH_SUCCESS = 'LOOKUP_LANGUAGES_FETCH_SUCCESS';
  static LOOKUP_ROLES_FETCH             = 'LOOKUP_ROLES_FETCH';
  static LOOKUP_ROLES_FETCH_SUCCESS     = 'LOOKUP_ROLES_FETCH_SUCCESS';
  static LOOKUP_USERS_FETCH             = 'LOOKUP_USERS_FETCH';
  static LOOKUP_USERS_FETCH_SUCCESS     = 'LOOKUP_USERS_FETCH_SUCCESS';

  private _languages: Array<ILookupLanguage>;
  private _roles: Array<ILookupRole>;
  private _users: Array<ILookupUser>;

  constructor(
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
  ) {
    this.state.subscribe(state => {
      this._languages = state.languages;
      this._roles = state.roles;
      this._users = state.users;
    });
  }

  get languages(): Observable<Array<ILookupLanguage>> {
    return this.getLanguages()
      .distinctUntilChanged();
  }

  get roles(): Observable<Array<ILookupRole>> {
    return this.getRoles()
      .distinctUntilChanged();
  }

  get users(): Observable<Array<ILookupUser>> {
    return this.getUsers()
      .distinctUntilChanged();
  }

  get languageOptions(): Observable<Array<IOption>> {
    return this.getLanguages()
      .map(roles => this.valueConverterService.valuesToOptions(roles))
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

  createRefreshLanguagesAction(): Action {
    return { type: LookupService.LOOKUP_LANGUAGES_FETCH };
  }

  createRefreshRolesAction(): Action {
    return { type: LookupService.LOOKUP_ROLES_FETCH };
  }

  createRefreshUsersAction(): Action {
    return { type: LookupService.LOOKUP_USERS_FETCH };
  }

  refreshLanguages(): void {
    const action = this.createRefreshLanguagesAction();
    this.store.dispatch(action);
  }

  refreshRoles(): void {
    const action = this.createRefreshRolesAction();
    this.store.dispatch(action);
  }

  refreshUsers(): void {
    const action = this.createRefreshUsersAction();
    this.store.dispatch(action);
  }

  private getLanguages(): Observable<Array<ILookupRole>> {
    if (!this._roles) {
      this.refreshRoles();
    }
    return this.state.map(state => state.roles).filter(Boolean).distinctUntilChanged();
  }

  private getRoles(): Observable<Array<ILookupLanguage>> {
    if (!this._languages) {
      this.refreshLanguages();
    }
    return this.state.map(state => state.languages).filter(Boolean).distinctUntilChanged();
  }

  private getUsers(): Observable<Array<ILookupUser>> {
    if (!this._users) {
      this.refreshUsers();
    }
    return this.state.map(state => state.users).filter(Boolean).distinctUntilChanged();
  }

  private get state(): Observable<ILookupState> {
    return this.store.select(state => state.lookup);
  }
}
