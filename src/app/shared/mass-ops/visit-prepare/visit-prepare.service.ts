
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IVisit, IVisitOperator, IOperationResult } from './visit-prepare.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';


@Injectable()
export class VisitPrepareService extends AbstractActionService {
  static MESSAGE_OPERATOR_SELECTED = 'MESSAGE_OPERATOR_SELECTED';

  private operatorUrl = '/users/forVisit';
  private visitUrl = '/mass/visits';

  constructor(
    protected actions: Actions,
    private actionGridService: ActionGridService,
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

  prepare(idData: IGridActionPayload, visit: IVisit): Observable<IOperationResult> {
    return this.dataService
      .update(`${this.visitUrl}/prepare`, {},
        {
          idData: this.actionGridService.buildRequest(idData),
          actionData: visit
        }
      )
      .catch(this.notificationsService.createError().entity('entities.visit.gen.singular').dispatchCallback());
  }

  cancel(idData: IGridActionPayload): Observable<IOperationResult> {
    return this.dataService
      .update(`${this.visitUrl}/cancel`, {},
        {
          idData: this.actionGridService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.deleteError().entity('entities.visit.gen.singular').dispatchCallback());
  }

  getVisitsCount(idData: IGridActionPayload): number {
    return this.actionGridService.getSelectionCount(idData) || 0;
  }

  isFilterAction(idData: IGridActionPayload): boolean {
    return this.actionGridService.isFilterAction(idData);
  }
}
