import { Injectable } from '@angular/core';

import { DebtService } from '@app/core/debt/debt.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, onClose: Function) => any } = {
    openDebtCard: (actionData: any, onClose: Function) => this.openDebtCard(actionData, onClose),
    openDebtCardByDebtor: (actionData: any, onClose: Function) => this.openDebtCardByDebtor(actionData, onClose),
    openIncomingCall: action => this.openIncomingCall(action),
  };

  constructor(
    private debtService: DebtService,
    private notificationsService: NotificationsService,
  ) { }

  openDebtCardByDebtor(actionData: any, onClose?: Function): void {
    this.debtService.getFirstDebtsByUserId(actionData)
      .subscribe( debtId => {
        if (!debtId) {
          this.notificationsService.warning('header.noDebt.title').dispatch();
          return;
        }
        this.openDebtCard({ debtId, ...actionData }, onClose);
      });
  }

  openDebtCard(actionData: any, onClose?: Function): Promise<void> {
    const { debtId } = actionData;
    return this.debtService.openByDebtId(debtId)
      .then(success => success && onClose ? onClose() : null);
  }

  openIncomingCall(actionData: any): Promise<boolean> {
    return this.debtService.openIncomingCall(actionData);
  }

}
