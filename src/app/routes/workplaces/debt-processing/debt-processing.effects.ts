import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { DebtProcessingService } from './debt-processing.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class DebtProcessingEffects {
  @Effect()
  fetch$ = this.actions
    .ofType(DebtProcessingService.DEBT_PROCESSING_FETCH)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const request = this.gridService.buildRequest(store.debtProcessing.grid, action.payload.filters);
      return this.read(request)
        .map(response => ({
          type: DebtProcessingService.DEBT_PROCESSING_FETCH_SUCCESS,
          payload: {
            debts: response.data
          },
        }))
        // TODO(d.maltsev): i18n
        .catch(this.notifications.error('errors.default.read').entity('entities.actionsLog.gen.plural').callback());
      }
    );

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private gridService: GridService,
    private notifications: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  read(request: any): Observable<any> {
    return this.dataService.create('/list?name=debtsprocessingall', {}, request);
  }
}
