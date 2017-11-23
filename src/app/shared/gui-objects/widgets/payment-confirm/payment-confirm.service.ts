import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAGridRequestParams, IAGridResponse } from '../../../components/grid2/grid2.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../components/grid2/filter/grid-filter';

import 'rxjs/add/operator/delay';

@Injectable()
export class PaymentConfirmService {
  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  private confirmUrl = '/mass/payments/confirm';
  private cancelUrl = '/mass/payments/cancel';


  paymentsConfirm(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.confirmUrl, {}, { idData: { ids } } )
        .do(res => {
          if (!res.success) {
            // TODO make dict when its will be fixed
            this.notificationsService.error('errors.default.read').entity('entities.user.constants.gen.plural').callback();
            return;
          }
        });
      // TODO unmock when api ready, make dict for catc
      // .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').callback());
   }

   paymentsCancel(
    ids: number[]
  ): Observable<any> {
      return this.dataService.update(this.cancelUrl, {}, { idData: { ids } } )
        .do(res => {
          if (!res.success) {
            // TODO make dict when its will be fixed
            this.notificationsService.error('errors.default.read').entity('entities.user.constants.gen.plural').callback();
            return;
          }
        });
      // TODO unmock when api ready, make dict for catc
      // .catch(this.notificationsService.updateError().entity('entities.managers.gen.singular').callback());
   }
}
