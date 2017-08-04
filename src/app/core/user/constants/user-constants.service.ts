import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../state/state.interface';
import { IUserConstant } from './user-constants.interface';

@Injectable()
export class UserConstantsService {
  static USER_CONSTANTS_FETCH         = 'USER_CONSTANTS_FETCH';
  static USER_CONSTANTS_FETCH_SUCCESS = 'USER_CONSTANTS_FETCH_SUCCESS';

  private constants: Array<IUserConstant>;

  constructor(private store: Store<IAppState>) {
    this.constants$.subscribe(constants => this.constants = constants);
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
    if (!this.constants) {
      this.refresh();
    }

    return this.constants$
      .filter(Boolean)
      .map(constants => constants.find(constant => constant.name === constantName))
      .distinctUntilChanged();
  }

  private get constants$(): Observable<Array<IUserConstant>> {
    return this.store.select(state => state.userConstants.constants);
  }
}
