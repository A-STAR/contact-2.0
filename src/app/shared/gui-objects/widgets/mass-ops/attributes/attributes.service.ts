import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { IDebtAttributeChange } from './attributes.interface';
import { ILookupPortfolio, ILookupTimeZone } from '../../../../../core/lookup/lookup.interface';
import { IOperationResult } from '../../debt-responsible/debt-responsible.interface';

import { LookupService } from '../../../../../core/lookup/lookup.service';
import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Injectable()
export class AttributesService {

  constructor(
    private dataService: DataService,
    private lookupService: LookupService,
    private notificationsService: NotificationsService
  ) { }

  change(debts: number[], data: IDebtAttributeChange): Observable<IOperationResult> {
    const ids = debts.map(debtId => [debtId]);
    return this.dataService
      .update('/mass/debts/attributechange', {}, { idData: { ids }, actionData: data })
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

  getPortfolios(): Observable<ILookupPortfolio[]> {
    return this.lookupService.portfolios;
  }

  getTimezones(): Observable<ILookupTimeZone[]> {
    return this.lookupService.timezone;
  }

}
