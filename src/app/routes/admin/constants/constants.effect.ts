import * as R from 'ramda';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import { ConstantsService } from './constants.service';

const savedState = localStorage.getItem(ConstantsService.STORAGE_KEY);

@Injectable()
export class ConstantsEffects {

  @Effect()
  init$ = defer(() => of({
    type: ConstantsService.CONSTANT_INIT,
    payload: R.tryCatch(JSON.parse, () => ({}))(savedState || undefined)
  }));
}
