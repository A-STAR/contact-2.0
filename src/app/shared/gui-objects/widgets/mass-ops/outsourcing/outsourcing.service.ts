import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';

import { IFilterPortfolio } from '@app/core/filters/grid-filters.interface';
import { IOperationResult } from '../../debt-responsible/debt-responsible.interface';

import { DataService } from '@app/core/data/data.service';
import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class OutsourcingService {

  private baseUrl = '/mass/debts/outsourcing';

  constructor(
    private dataService: DataService,
    private gridFiltersService: GridFiltersService,
    private notificationsService: NotificationsService
  ) { }


  send(debts: number[], data: IFilterPortfolio): Observable<IOperationResult> {
    const ids = debts.map(debtId => [debtId]);
    return this.dataService
      .update(`${this.baseUrl}/send`, {}, { idData: { ids }, actionData: { outPortfolioId: data.id } })
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

  exclude(debts: number[]): Observable<IOperationResult> {
    const ids = debts.map(debtId => [debtId]);
    return this.dataService
      .update(`${this.baseUrl}/exclude`, {}, { idData: { ids }, actionData: { } })
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

  return(debts: number[]): Observable<IOperationResult> {
    const ids = debts.map(debtId => [debtId]);
    return this.dataService
      .update(`${this.baseUrl}/return`, {}, { idData: { ids }, actionData: { } })
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
