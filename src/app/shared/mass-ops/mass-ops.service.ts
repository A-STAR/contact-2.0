import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { Debt } from '@app/entities';

@Injectable()
export class MassOperationsService {

  nonDlgActions: { [key: string]: (actionData: any, onClose: Function) => any } = {
    openDebtCard: (actionData: any, onClose: Function) => this.openDebtCard(actionData, onClose),
    openDebtCardByDebtor: (actionData: any, onClose: Function) => this.openDebtCardByDebtor(actionData, onClose),
    openIncomingCall: action => this.openIncomingCall(action),
  };

  constructor(
    private dataService: DataService,
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
        this.openDebtorCard(debtorId, debtId, onClose);
      });
  }

  openDebtCard(actionData: any, onClose?: Function): void {
    const { debtId, debtorId, personRole, personId, contractId } = actionData;

    switch (personRole) {
      case 2:
        this.onAction(() => this.openGuarantorCard(debtorId, debtId, contractId, personId), onClose);
        break;
      case 3:
        this.openPledgorCardByParams(debtorId, debtId, contractId, personId, onClose);
        break;
      case 4:
        this.onAction(() => this.openContactPersonCard(debtorId, debtId, personId), onClose);
        break;
      case 1:
      default:
        this.openDebtorCard(debtorId, debtId, onClose);
        break;
    }

  }

  openDebtorCard(debtorId: any, debtId: any, onClose: Function): void {
    debtorId
      ? this.onAction(() => this.openByDebtId(debtId, debtorId), onClose)
      : this.getDebtorIdByDebtId(debtId)
        .pipe(first())
        .subscribe(id => {
          this.onAction(() => this.openByDebtId(debtId, id), onClose);
        });
  }

  getFirstDebtsByUserId(payload: any): Observable<number> {
    return this.repo.fetch(Debt, { personId: payload.personId })
      .pipe(
        map(res => res && res[0].id)
      );
  }

  getFirstPersonPropertyId(personId: number): Observable<number> {
      return this.dataService.readAll(`/persons/{personId}/property`, { personId })
        .pipe(
          map(properties => properties && properties[0]),
          map(property => property && property.id),
        )
        .catch(this.notificationsService.fetchError().entity('entities.property.gen.plural').dispatchCallback());
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

  openGuarantorCard(debtorId: number, debtId: number, contractId: number, guarantorId: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit/guarantee/${contractId}/guarantor/${guarantorId}`
    ]);
  }

  openPledgorCardByParams(debtorId: number, debtId: number, pledgeId: number, pledgorId: number, onClose: Function = null): void {
    this.getFirstPersonPropertyId(pledgorId)
      .subscribe(propertyId => this.onAction(
        () => this.openPlegdorCard(debtorId, debtId, pledgeId, pledgorId, propertyId),
        onClose
      ));
  }

  openPlegdorCard(debtorId: number, debtId: number, pledgeId: number, pledgorId: number, propertyId: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/pledge/${pledgeId}/pledgor/${pledgorId}/property/${propertyId}`
    ]);
  }

  openContactPersonCard(debtorId: number, debtId: number, personId: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/contact/${personId}`
    ]);
  }

  openIncomingCall(debtId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/incoming-call/${debtId}` ]);
  }

  private onAction(redirect: () => Promise<Boolean>, onClose: Function = null): void {
    redirect().then(success => success && onClose ? onClose() : null);
  }
}
