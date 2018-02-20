import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperationResult } from './debt-responsible.interface';
import { IOperator } from '../operator/operator.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class DebtResponsibleService {

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSet$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'DEBT_RESPONSIBLE_SET', 'DEBT_RESPONSIBLE_RESET' ]);
  }

  get canClear$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_RESPONSIBLE_CLEAR');
  }

  setResponsible(idData: IGridActionPayload, operator: IOperator): Observable<IOperationResult> {
    return this.dataService
      .create('/mass/debts/setResponsible', {},
        {
         idData: this.actionGridFilterService.buildRequest(idData),
         actionData: { userId: operator.id }
        }
      )
      .catch(this.notificationsService.error('errors.default.add').entity('entities.operator.gen.singular').dispatchCallback());
  }

  clearResponsible(idData: IGridActionPayload): Observable<IOperationResult> {
    return this.dataService
      .create('/mass/debts/clearResponsible', {},
        {
          idData: this.actionGridFilterService.buildRequest(idData)
        }
      )
      .catch(this.notificationsService.deleteError().entity('entities.operator.gen.singular').dispatchCallback());
  }

  showOperationNotification(result: IOperationResult): void {
    if (!result.success) {
      this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(result).dispatch();
    } else {
      this.notificationsService.info().entity('default.dialog.result.message').response(result).dispatch();
    }
  }
}
