import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IConstant, IConstantsResponse, TConstantValue, IConstantsState } from './constants.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { ValueConverterService } from '../converter/value/value-converter.service';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';

  static CONSTANT_FETCH             = 'CONSTANT_FETCH';
  static CONSTANT_FETCH_SUCCESS     = 'CONSTANT_FETCH_SUCCESS';
  static CONSTANT_SELECTED_CONSTANT = 'CONSTANT_SELECTED_CONSTANT';

  private constants: Map<string, TConstantValue> = new Map<string, TConstantValue>();

  constructor(
    private store: Store<IAppState>,
    private gridService: GridService,
    private valueConverterService: ValueConverterService
  ) {
    // TODO Temp solution
    this.loadConstants()
      .take(1)
      .subscribe(
        () => {},
        // TODO: log using notification service
        err => console.error(err)
      );
  }

  get state(): Observable<IConstantsState> {
    return this.store.select('constants');
  }

  loadConstants(): Observable<IConstantsResponse> {
    return this.gridService.read('/api/constants')
      .map((response: IConstantsResponse) => {
        response.constants.forEach((constant: IConstant) => {
          this.constants.set(constant.name, this.valueConverterService.deserialize(constant).value);
        });
        return response;
      });
  }

  changeSelected(payload: IConstant): void {
    this.store.dispatch({ type: ConstantsService.CONSTANT_SELECTED_CONSTANT, payload });
  }

  get(constantName: string): TConstantValue {
    return this.constants.get(constantName);
  }
}
