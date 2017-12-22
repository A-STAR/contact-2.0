import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { IAppState } from '../../state/state.interface';
import { IUserConstant, IUserConstants } from './user-constants.interface';

import { ValueBag } from '../../value-bag/value-bag';

@Injectable()
export class UserConstantsService {
  static USER_CONSTANTS_FETCH         = 'USER_CONSTANTS_FETCH';
  static USER_CONSTANTS_FETCH_SUCCESS = 'USER_CONSTANTS_FETCH_SUCCESS';

  private isFetching = false;

  constructor(private store: Store<IAppState>) {}

  createRefreshAction(): Action {
    return {
      type: UserConstantsService.USER_CONSTANTS_FETCH
    };
  }

  refresh(): void {
    this.isFetching = true;
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  bag(): Observable<ValueBag> {
    return this.constants$.pipe(
      map(constants => new ValueBag(constants)),
      distinctUntilChanged(),
    );
  }

  get(constantName: string): Observable<IUserConstant> {
    return this.constants$.pipe(
      map(constants => constants[constantName]),
      distinctUntilChanged(),
    );
  }

  private get constants$(): Observable<IUserConstants> {
    return this.store
      .select(state => state.userConstants.constants)
      .pipe(
        tap(constants => {
          if (constants) {
            this.isFetching = false;
          } else {
            this.refresh();
          }
        }),
        filter(Boolean),
        distinctUntilChanged(),
      );
  }
}
