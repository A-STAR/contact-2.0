import { Injectable } from '@angular/core';

import { DebtService } from '@app/core/debt/debt.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { first } from 'rxjs/operators';

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
    const { debtorId } = actionData;
    this.debtService.getFirstDebtsByUserId(actionData)
      .subscribe( debtId => {
        if (!debtId) {
          this.notificationsService.warning('header.noDebt.title').dispatch();
          return;
        }
        this.openCard(debtorId, debtId, onClose);
      });
  }

  openDebtCard(actionData: any, onClose?: Function): Promise<void> {
    const { debtId, debtorId } = actionData;
    return debtorId
      ? this.openCard(debtorId, debtId, onClose)
      : this.debtService
          .getDebtorIdByDebtId(debtId)
          // see https://github.com/ReactiveX/rxjs/issues/2536
          .pipe(first())
          .toPromise()
          .then(id => {
            this.openCard(id, debtId, onClose);
          });
  }

  openIncomingCall(actionData: any): Promise<boolean> {
    return this.debtService.openIncomingCall(actionData);
  }

  private openCard(debtorId: number, debtId: number, onClose: Function = null): Promise<void> {
    return this.debtService
      .openByDebtId(debtId, debtorId)
      .then(success => success && onClose ? onClose() : null);
  }
}
