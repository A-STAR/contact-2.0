import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IUser, IUsersState, IUserDialogActionEnum } from './users.interface';

import { GridService } from '../../../shared/components/grid/grid.service';

@Injectable()
export class UsersService {
  static USERS_FETCH         = 'USERS_FETCH';
  static USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
  static USERS_CLEAR         = 'USERS_CLEAR';
  static USER_CREATE         = 'USER_CREATE';
  static USER_UPDATE         = 'USER_UPDATE';
  static USER_SELECT         = 'USER_SELECT';
  static USER_DIALOG_ACTION  = 'USER_DIALOG_ACTION';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>
  ) {}

  get state(): Observable<IUsersState> {
    return this.store
      .select(state => state.users)
      .filter(Boolean);
  }

  fetch(): void {
    return this.store.dispatch({
      type: UsersService.USERS_FETCH
    });
  }

  create(user: IUser): void {
    return this.store.dispatch({
      type: UsersService.USER_CREATE,
      payload: {
        user
      }
    });
  }

  update(user: IUser): void {
    return this.store.dispatch({
      type: UsersService.USER_UPDATE,
      payload: {
        user
      }
    });
  }

  select(userId: number): void {
    return this.store.dispatch({
      type: UsersService.USER_SELECT,
      payload: {
        userId
      }
    });
  }

  setDialogAction(dialogAction: IUserDialogActionEnum): void {
    return this.store.dispatch({
      type: UsersService.USER_DIALOG_ACTION,
      payload: {
        dialogAction
      }
    });
  }

  getLanguages(): Observable<any> {
    return this.gridService.read('/api/userlanguages')
      .map(data => data.languages.map(lang => ({ label: lang.name, value: lang.id })));
  }

  getRoles(): Observable<ILabeledValue[]> {
    return this.gridService.read('/api/roles')
      .map(data => data.roles.map(role => ({ label: role.name, value: role.id })));
  }
}
