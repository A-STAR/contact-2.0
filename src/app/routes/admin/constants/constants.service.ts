import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IConstant, IConstantsState } from './constants.interface';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';

  static CONSTANT_FETCH         = 'CONSTANT_FETCH';
  static CONSTANT_FETCH_SUCCESS = 'CONSTANT_FETCH_SUCCESS';
  static CONSTANT_SELECT        = 'CONSTANT_SELECT';
  static CONSTANT_CLEAR         = 'CONSTANT_CLEAR';

  constructor(
    private store: Store<IAppState>,
  ) {}

  get state(): Observable<IConstantsState> {
    return this.store.select('constants');
  }

  clear(): void {
    this.store.dispatch({
      type: ConstantsService.CONSTANT_CLEAR
    });
  }

  changeSelected(payload: IConstant): void {
    this.store.dispatch({
      type: ConstantsService.CONSTANT_SELECT,
      payload
    });
  }
}
