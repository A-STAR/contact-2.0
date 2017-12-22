import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
    const ids = debts.map(debtId => [ debtId ]);
    return this.dataService
      .update('/mass/debts/statuschange', {}, { idData: { ids }, actionData: data })
      .catch(this.notificationsService.error('errors.default.update')
        .entity('entities.operator.gen.singular').dispatchCallback());
  }

  getPortfolios(): Observable<ILookupPortfolio[]> {
    return this.lookupService.portfolios;
  }

  getTimezones(): Observable<ILookupTimeZone[]> {
    return this.lookupService.timezone;
  }

}
