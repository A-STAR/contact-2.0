import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserConstant, IUserConstantsState } from './user-constants.interface';

@Injectable()
export class UserConstantsService {
  static USER_CONSTANTS_FETCH         = 'USER_CONSTANTS_FETCH';
  static USER_CONSTANTS_FETCH_SUCCESS = 'USER_CONSTANTS_FETCH_SUCCESS';
  static USER_CONSTANTS_FETCH_FAILURE = 'USER_CONSTANTS_FETCH_FAILURE';

  constructor(private store: Store<IAppState>) {}

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.isResolved)
      .filter(isResolved => isResolved !== null);
  }

  createRefreshAction(): Action {
    return {
      type: UserConstantsService.USER_CONSTANTS_FETCH
    };
  }

  refresh(): void {
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  get(constantName: string): Observable<IUserConstant> {
    return this.state.map(state => state.constants.find(constant => constant.name === constantName));
  }

  private get state(): Observable<IUserConstantsState> {
    return this.store.select(state => state.userConstants);
  }
}
