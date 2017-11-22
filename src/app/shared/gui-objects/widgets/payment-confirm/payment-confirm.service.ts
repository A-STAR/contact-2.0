import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../components/grid2/grid2.interface';

import { IPaymentDialog } from './payment-confirm.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../components/grid2/filter/grid-filter';

@Injectable()
export class PaymentConfirmService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  private baseUrl = 'mass/payments/confirm';

  paymentsConfirm(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.baseUrl, null, { idData: { ids } } )
      // TODO unmock when api ready
         .catch(() => {
           console.log('from service catch');
           return Observable.of({
            success: true,
            massInfo:    {
              total: 2,
              processed: 2
            }
        }); });
   }
  // : Observable<IAGridResponse<IContact>>

    // const request = this.gridService.buildRequest(params, filters);
    // return this.dataService
    //   .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, request)
    //   .catch(this.notificationsService.fetchError().entity(`entities.contacts.gen.plural`).dispatchCallback());
  // }
}
