import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IFilterPortfolio } from '@app/core/filters/grid-filters.interface';
import { IOperationResult } from '@app/shared/mass-ops/debt-responsible/debt-responsible.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '@app/core/data/data.service';
import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class OutsourcingService {

  private baseUrl = '/mass/debts/outsourcing';

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private gridFiltersService: GridFiltersService,
    private notificationsService: NotificationsService
  ) { }


  send(idData: IGridActionPayload, data: IFilterPortfolio): Observable<IOperationResult> {
    return this.dataService
      .update(`${this.baseUrl}/send`, {},
        {
          idData: this.actionGridFilterService.buildRequest(idData),
          actionData: { outPortfolioId: data.id }
        }
      )
      .pipe(
      tap(response => {
        if (response.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
        } else {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
        }
      }),
      catchError(this.notificationsService.updateError().entity('entities.attribute.gen.plural').dispatchCallback()));
  }

  exclude(idData: IGridActionPayload): Observable<IOperationResult> {
    return this.dataService
      .update(`${this.baseUrl}/exclude`, {},
        {
          idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .pipe(
      tap(response => {
        if (response.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
        } else {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
        }
      }),
      catchError(this.notificationsService.updateError().entity('entities.attribute.gen.plural').dispatchCallback()));
  }

  return(idData: IGridActionPayload): Observable<IOperationResult> {
    return this.dataService
      .update(`${this.baseUrl}/return`, {},
        {
         idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .pipe(
      tap(response => {
        if (response.success) {
          this.notificationsService.info().entity('default.dialog.result.message').response(response).dispatch();
        } else {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(response).dispatch();
        }
      }),
      catchError(this.notificationsService.updateError().entity('entities.attribute.gen.plural').dispatchCallback()));
  }

  getOutsourcingPortfolios(): Observable<IFilterPortfolio[]> {
    // statusCodes = 4, directionsCodes = 2
    return this.gridFiltersService.fetchPortfolios([ 4 ], [ 2 ]);
  }

}
