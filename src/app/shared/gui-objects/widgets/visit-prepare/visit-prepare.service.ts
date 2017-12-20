
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';

import { AbstractActionService } from '../../../../core/state/action.service';

@Injectable()
export class VisitPrepareService extends AbstractActionService {
  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }
}
