import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperationResult } from '@app/shared/mass-ops/debt-responsible/debt-responsible.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PersonTypeService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  change(idData: IGridActionPayload, typeCode: number): Observable<IOperationResult> {
    return this.dataService
      .update('mass/persons/typechange', {},
        {
         idData: this.actionGridService.buildRequest(idData),
         actionData: { typeCode }
        }
      )
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.persons.gen.plural').dispatchCallback())
      );
  }

}
