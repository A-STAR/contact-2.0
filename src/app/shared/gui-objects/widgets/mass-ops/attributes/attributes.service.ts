import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { IDebtAttributeChange, DictOperationPerms } from './attributes.interface';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { ILookupPortfolio, ILookupTimeZone } from '../../../../../core/lookup/lookup.interface';
import { IOperationResult } from '../../debt-responsible/debt-responsible.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { DataService } from '../../../../../core/data/data.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class AttributesService {

  private dictOperations: number[] = [
    UserDictionariesService.DICTIONARY_DEBT_LIST_1,
    UserDictionariesService.DICTIONARY_DEBT_LIST_2,
    UserDictionariesService.DICTIONARY_DEBT_LIST_3,
    UserDictionariesService.DICTIONARY_DEBT_LIST_4,
  ];

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private lookupService: LookupService,
    private notificationsService: NotificationsService
  ) { }

  change(idData: IGridActionPayload, data: IDebtAttributeChange): Observable<IOperationResult> {
    return this.dataService
      .update('/mass/debts/attributechange', {},
        {
         idData: this.actionGridFilterService.buildRequest(idData),
         actionData: data
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

  getPortfolios(): Observable<ILookupPortfolio[]> {
    return this.lookupService.lookup<ILookupPortfolio>('portfolios');
  }

  getTimezones(): Observable<ILookupTimeZone[]> {
    return this.lookupService.lookup<ILookupTimeZone>('timeZone');
  }

  isDictCodeOperation(dictCode: number): boolean {
    return this.dictOperations.indexOf(dictCode) !== -1;
  }

  getDictCodePermName(dictCode: number): string {
    return DictOperationPerms[dictCode];
  }

}
