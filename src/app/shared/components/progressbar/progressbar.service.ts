import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';

import { AbstractActionService } from '@app/core/state/action.service';

@Injectable()
export class ProgressBarService extends AbstractActionService {
  static MESSAGE_PROGRESS = 'MESSAGE_PROGRESS';

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>
  ) {
    super();
  }
}
