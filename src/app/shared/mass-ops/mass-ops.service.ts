import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';

import { RepositoryService } from '@app/core/repository/repository.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { Observable } from 'rxjs/Observable';
import { Debt } from '@app/entities';

@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, onClose: Function) => any } = {
    openDebtCard: (actionData: any, onClose: Function) => this.openDebtCard(actionData, onClose),
    openDebtCardByDebtor: (actionData: any, onClose: Function) => this.openDebtCardByDebtor(actionData, onClose),
    openIncomingCall: action => this.openIncomingCall(action),
  };

  constructor(
    private repo: RepositoryService,
    private routingService: RoutingService,
    private notificationsService: NotificationsService,
  ) { }

  openDebtCardByDebtor(actionData: any, onClose?: Function): void {
    const { debtorId } = actionData;
    this.getFirstDebtsByUserId(actionData)
      .pipe(first())
      .subscribe( debtId => {
        if (!debtId) {
          this.notificationsService.warning('header.noDebt.title').dispatch();
          return;
        }
        this.openCard(debtorId, debtId, onClose);
      });
  }

  openDebtCard(actionData: any, onClose?: Function): void {

    const { debtId, debtorId } = actionData;
    // personRole = 2 personId === guarantorId, guarantee = contractId
    // personRole = 3 personId === pledgor , pledge === contractId property === properties[0] ?
    // personRole = 4 personId === person - ?
    debtorId
      ? this.openCard(debtorId, debtId, onClose)
      : this.getDebtorIdByDebtId(debtId)
          .pipe(first())
          .subscribe(id => {
            this.openCard(id, debtId, onClose);
          });
  }

  getFirstDebtsByUserId(payload: any): Observable<number> {
    return this.repo.fetch(Debt, { personId: payload.personId })
      .pipe(
        map(res => res && res[0].id)
      );
  }

  getDebtorIdByDebtId(debtId: number): Observable<number> {
    return this.repo.fetch(Debt, { id: debtId })
      .pipe(
        map(response => response && response[0].personId)
      );
  }

  openByDebtId(debtId: number, debtorId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
  }

  openIncomingCall(debtId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/incoming-call/${debtId}` ]);
  }

  private openCard(debtorId: number, debtId: number, onClose: Function = null): Promise<void> {
    return this.openByDebtId(debtId, debtorId)
      .then(success => success && onClose ? onClose() : null);
  }
}
