import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import {
  IGridActionPayload,
  ISelectionIds,
  ISelectionFilter,
} from '@app/shared/components/action-grid/action-grid.interface';
import { MetadataActionType } from '@app/core/metadata/metadata.interface';
import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class  NextCallDateSetService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  private url = '/mass/debts/nextCall';

  setNextCall(idData: IGridActionPayload, nextCallDateTime: string): Observable<any> {
    const payload = idData.type === MetadataActionType.ALL ? this.setNextCallForAll(idData as ISelectionFilter) :
    this.setNextCallForSelected(idData as ISelectionIds);
    return this.setNextCallAction(payload, { nextCallDateTime });
  }

  private setNextCallForSelected(idData: ISelectionIds): { ids: (number | string)[][] } {
    return {
      ids: idData.data['debtId'].map(id => [ id ])
    };
  }

  private setNextCallForAll(idData: ISelectionFilter): { filter: FilterObject, gridName: string } {
    return idData.data;
  }

  private setNextCallAction(idData: any, actionData: any): Observable<any> {
    return this.dataService.update(this.url, {}, { idData, actionData } )
      .map(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.nextCallDate.gen.plural').dispatchCallback());
  }

}
