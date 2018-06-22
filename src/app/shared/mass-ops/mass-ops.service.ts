import { Injectable } from '@angular/core';

import { DebtApiService } from '@app/core/api/debt.api';
import { RoutingService } from '@app/core/routing/routing.service';


@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, onClose: Function) => any } = {
    openDebtCard: (actionData: any, onClose: Function) => this.debtApiService.openDebtCard(actionData, onClose),
    openDebtCardByDebtor: (actionData: any, onClose: Function) => this.debtApiService.openDebtCardByDebtor(actionData, onClose),
    openIncomingCall: action => this.openIncomingCall(action),
  };

  constructor(
    private debtApiService: DebtApiService,
    private routingService: RoutingService,
  ) { }

  openByDebtId(debtId: number, debtorId: number): Promise<boolean> {
    return this.debtApiService.openByDebtId(debtId, debtorId);
  }

  openIncomingCall(debtId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/incoming-call/${debtId}` ]);
  }
}
