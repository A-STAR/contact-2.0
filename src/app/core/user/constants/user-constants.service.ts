import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IUserConstant, IUserConstants } from './user-constants.interface';

import { ValueBag } from '@app/core/value-bag/value-bag';

@Injectable()
export class UserConstantsService {
  static USER_CONSTANTS_FETCH         = 'USER_CONSTANTS_FETCH';
  static USER_CONSTANTS_FETCH_SUCCESS = 'USER_CONSTANTS_FETCH_SUCCESS';

  private constants$ = this.store
    .select(state => state.userConstants.constants)
    .pipe(
      tap(constants => {
        if (constants) {
          this.isFetching = false;
        } else if (!this.isFetching) {
          this.refresh();
        }
      }),
      filter(Boolean),
      distinctUntilChanged(),
    );

  private bag$ = this.constants$.pipe(
    map(constants => new ValueBag(constants)),
    distinctUntilChanged(),
  );

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
    return this.bag$;
  }

  get(constantName: string): Observable<IUserConstant> {
    return this.constants$.pipe(
      map(constants => constants[constantName]),
      distinctUntilChanged(),
    );
  }
}
