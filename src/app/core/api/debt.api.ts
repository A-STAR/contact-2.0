import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { Debt } from '@app/entities';

@Injectable()
export class DebtApiService {

  constructor(
    private dataService: DataService,
    private repo: RepositoryService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private notificationsService: NotificationsService,
  ) { }

  openDebtCard(actionData: any, onClose?: Function, activeCallId?: number): void {
    const { debtId, debtorId, personRole, personId, contractId } = actionData;

    const debtorId$ = debtorId
      ? of(debtorId)
      : this.getDebtorIdByDebtId(debtId);

    debtorId$
      .pipe(
        first()
      )
      .subscribe(id => {
        switch (personRole) {
          case 2:
            this.onAction(() => this.openGuarantorCard(id, debtId, contractId, personId, activeCallId), onClose);
            break;
          case 3:
            this.openPledgorCardByParams(id, debtId, contractId, personId, onClose, activeCallId);
            break;
          case 4:
            this.onAction(() => this.openContactPersonCard(id, debtId, personId, activeCallId), onClose);
            break;
          case 1:
          default:
            this.onAction(() => this.openByDebtId(debtId, debtorId, activeCallId), onClose);
            break;
        }
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

  openByDebtId(debtId: number, debtorId: number, activeCallId?: number): Promise<boolean> {
    return this.routingService.navigate([
      `/app/workplaces/debtor/${debtorId}/debt/${debtId}`
    ], this.route, { activeCallId });
  }

  openGuarantorCard(debtorId: number, debtId: number, contractId: number,
    guarantorId: number, activeCallId?: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit/guarantee/${contractId}/guarantor/${guarantorId}`
    ], this.route, { activeCallId });
  }

  openPledgorCardByParams(debtorId: number, debtId: number, pledgeId: number,
    pledgorId: number, onClose: Function = null, activeCallId?: number): void {
    this.getFirstPersonPropertyId(pledgorId)
      .subscribe(propertyId => this.onAction(
        () => this.openPlegdorCard(debtorId, debtId, pledgeId, pledgorId, propertyId, activeCallId),
        onClose
      ));
  }

  openPlegdorCard(debtorId: number, debtId: number, pledgeId: number, pledgorId: number,
    propertyId: number, activeCallId?: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit/pledge/${pledgeId}/pledgor/${pledgorId}/property/${propertyId}`
    ], this.route, { activeCallId });
  }

  openContactPersonCard(debtorId: number, debtId: number, personId: number, activeCallId?: number): Promise<boolean> {
    return this.routingService.navigate([
        `/app/workplaces/debtor/${debtorId}/debt/${debtId}/contact/${personId}`
    ], this.route, { activeCallId });
  }

  openIncomingCall(debtId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/incoming-call/${debtId}` ]);
  }

  private onAction(redirect: () => Promise<Boolean>, onClose: Function = null): void {
    redirect().then(success => success && onClose ? onClose() : null);
  }
}
