
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IVisit, IVisitOperator, IOperationResult } from './visit-prepare.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';


@Injectable()
export class VisitPrepareService extends AbstractActionService {
  static MESSAGE_OPERATOR_SELECTED = 'MESSAGE_OPERATOR_SELECTED';

  private operatorUrl = '/users/forVisit';
  private visitUrl = '/mass/visits';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchOperators(): Observable<Array<IVisitOperator>> {
    return this.dataService.readAll(this.operatorUrl)
      .catch(this.notificationsService.fetchError().entity('entities.operator.gen.plural').dispatchCallback());
  }

  prepare(visits: number[], visit: IVisit): Observable<IOperationResult> {
    const ids = visits.map(visitId => [ visitId ]);
    return this.dataService
      .update(`${this.visitUrl}/prepare`, {}, { idData: { ids }, actionData: visit })
      .catch(this.notificationsService.createError().entity('entities.visit.gen.singular').dispatchCallback());
  }

  cancel(visits: number[]): Observable<IOperationResult> {
    const ids = visits.map(visitId => [ visitId ]);
    return this.dataService
      .update(`${this.visitUrl}/cancel`, {}, { idData: { ids }, actionData: {} })
      .catch(this.notificationsService.deleteError().entity('entities.visit.gen.singular').dispatchCallback());
  }

  showOperationNotification(result: IOperationResult): void {
    if (!result.success) {
      this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(result).dispatch();
    } else {
      this.notificationsService.info().entity('default.dialog.result.message').response(result).dispatch();
    }
  }
}
