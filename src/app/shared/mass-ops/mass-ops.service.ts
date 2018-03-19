import { Injectable, EventEmitter } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DebtService } from '@app/core/debt/debt.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, close: EventEmitter<ICloseAction>) => any } = {
    openDebtCard: (actionData: any, close: EventEmitter<ICloseAction>) => this.openDebtCard(actionData, close),
    openDebtCardByDebtor: (actionData: any, close: EventEmitter<ICloseAction>) => this.openDebtCardByDebtor(actionData, close),
    openIncomingCall: action => this.openIncomingCall(action),
  };

  constructor(
    private debtService: DebtService,
    private notificationsService: NotificationsService,
  ) { }

  openDebtCardByDebtor(actionData: any, close?: EventEmitter<ICloseAction>): void {
    this.debtService.getFirstDebtsByUserId(actionData)
      .subscribe( debtId => {
        if (!debtId) {
          this.notificationsService.warning('header.noDebt.title').dispatch();
          return;
        }
        this.openDebtCard({ debtId, ...actionData }, close);
      });
  }

  openDebtCard(actionData: any, close?: EventEmitter<any>): Promise<void> {
    const { debtId } = actionData;
    return this.debtService.openByDebtId(debtId)
      .then(success => success && close && close.emit ? close.emit(actionData) : null);
  }

  openIncomingCall(actionData: any): Promise<boolean> {
    return this.debtService.openIncomingCall(actionData);
  }

}
