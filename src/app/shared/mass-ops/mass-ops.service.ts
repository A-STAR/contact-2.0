import { Injectable } from '@angular/core';

import { DebtApiService } from '@app/core/api/debt.api';
import { IncomingCallApiService } from '@app/core/api/incoming-call.api';


@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, onClose: Function) => any } = {
    openDebtCard: (actionData: any, onClose: Function) => this.debtApiService.openDebtCard(actionData, onClose),
    openDebtCardByDebtor: (actionData: any, onClose: Function) => this.debtApiService.openDebtCardByDebtor(actionData, onClose),
    openIncomingCall: (actionData: any) => this.incomingCallApiService.openIncomingCallCard(actionData),
  };

  constructor(
    private debtApiService: DebtApiService,
    private incomingCallApiService: IncomingCallApiService,
  ) { }

  openByDebtId(debtId: number, debtorId: number): Promise<boolean> {
    return this.debtApiService.openByDebtId(debtId, debtorId);
  }
}
