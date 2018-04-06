import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IAddress, IPhone, IDebt, IDebtNextCall, IDebtOpenIncomingCallData } from '@app/core/debt/debt.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class DebtService {
  static CONTACT_TYPE_INCOMING_CALL = 1;
  static CONTACT_TYPE_OUTGOING_CALL = 2;
  static CONTACT_TYPE_ADDRESS_VISIT = 3;
  static CONTACT_TYPE_SPECIAL       = 7;
  static CONTACT_TYPE_OFFICE_VISIT  = 8;

  static MESSAGE_DEBT_SELECTED = 'MESSAGE_DEBT_SELECTED';

  baseUrl = '/persons/{personId}/debts';
  extUrl = `${this.baseUrl}/{debtId}`;

  private _incomingCallSearchParams$ = new BehaviorSubject<IDebtOpenIncomingCallData>(null);

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  readonly canRegisterIncomingCalls$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_INCOMING_CALL);

  canRegisterIncomingCall$(phone: IPhone): Observable<boolean> {
    return phone && !phone.isInactive ? this.canRegisterIncomingCalls$ : of(false);
  }

  readonly canRegisterAddressVisits$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_ADDRESS_VISIT);

  canRegisterAddressVisit$(address: IAddress): Observable<boolean> {
    return address && !address.isInactive ? this.canRegisterAddressVisits$ : of(false);
  }

  readonly canRegisterSpecialOrOfficeVisit$ = this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [
    DebtService.CONTACT_TYPE_SPECIAL,
    DebtService.CONTACT_TYPE_OFFICE_VISIT
  ]);

  readonly canRegisterSpecial$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_SPECIAL);

  readonly canRegisterOfficeVisit$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_OFFICE_VISIT);

  get incomingCallSearchParams(): any {
    return this._incomingCallSearchParams$;
  }

  set incomingCallSearchParams(data: any) {
    this._incomingCallSearchParams$.next(data);
  }

  canRegisterContactForDebt$(debt: { statusCode: number }): Observable<boolean> {
    return combineLatest(
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG'),
      this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [
        DebtService.CONTACT_TYPE_INCOMING_CALL,
        DebtService.CONTACT_TYPE_ADDRESS_VISIT,
        DebtService.CONTACT_TYPE_SPECIAL,
        DebtService.CONTACT_TYPE_OFFICE_VISIT,
      ]),
    ).map(([ canRegisterClosed, canRegister ]) => (this.isDebtActive(debt) || canRegisterClosed) && canRegister);
  }

  isDebtActive(debt: { statusCode: number }): boolean {
    return debt && ![6, 7, 8, 17].includes(debt.statusCode);
  }

  /**
   * @deprecated
   * Use /routes/workplaces/workplaces.service instead
   */
  fetchAll(personId: number): Observable<Array<IDebt>> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback());
  }

  /**
   * @deprecated
   * Use /routes/workplaces/workplaces.service instead
   */
  fetch(personId: number, debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { personId, debtId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, debt: Partial<IDebt>): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { personId }, debt)
      .catch(this.notificationsService.createError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  update(personId: number, debtId: number, debt: Partial<IDebt>): Observable<void> {
    return this.dataService
      .update(this.extUrl, { debtId, personId }, debt)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  changeStatus(personId: number, debtId: number, debt: Partial<IDebt>, callCenter: boolean): Observable<any> {
    return this.dataService
      .update(`${this.extUrl}/statuschange`, { debtId, personId }, debt, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  setNextCallDate(debtId: number, call: IDebtNextCall): Observable<void> {
    return this.dataService
      .update('/debts/{debtId}/nextCall', { debtId }, call)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  getFirstDebtsByUserId(payload: any): Observable<any> {
    return this.dataService.read(this.baseUrl, payload)
      .map(res => res && res.id)
      .catch(this.notificationsService.deleteError().entity('entities.debts.gen.plural').dispatchCallback());
  }

  openByDebtId(debtId: number): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/debtor-card/${debtId}` ]);
  }

  openIncomingCall(data: any): Promise<boolean> {
    return this.routingService.navigate([ '/app/workplaces/incoming-call' ])
      .then(success => success ? (this.incomingCallSearchParams = data) : null);
  }
}
