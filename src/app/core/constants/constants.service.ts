import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IConstant, TConstantValue, IConstantsState } from './constants.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { ValueConverterService } from '../converter/value/value-converter.service';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';

  static CONSTANT_FETCH         = 'CONSTANT_FETCH';
  static CONSTANT_FETCH_SUCCESS = 'CONSTANT_FETCH_SUCCESS';
  static CONSTANT_SELECT        = 'CONSTANT_SELECT';
  static CONSTANT_CLEAR         = 'CONSTANT_CLEAR';

  constructor(
    private store: Store<IAppState>,
    private gridService: GridService,
    private valueConverterService: ValueConverterService
  ) {}

  get state(): Observable<IConstantsState> {
    return this.store.select('constants');
  }

  fetch(): void {
    this.store.dispatch({
      type: ConstantsService.CONSTANT_FETCH
    });
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
