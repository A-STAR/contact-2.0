import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IAddress, IContactRegistrationParams, IPhone, IDebt, IDebtNextCall } from './debt.interface';

import { ContentTabService } from '../../shared/components/content-tabstrip/tab/content-tab.service';
import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserPermissionsService } from '../user/permissions/user-permissions.service';

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

  constructor(
    private contentTabService: ContentTabService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canRegisterIncomingCalls$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_INCOMING_CALL);
  }

  canRegisterIncomingCall$(phone: IPhone): Observable<boolean> {
    return phone && !phone.isInactive ? this.canRegisterIncomingCalls$ : Observable.of(false);
  }

  get canRegisterAddressVisits$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_ADDRESS_VISIT);
  }

  canRegisterAddressVisit$(address: IAddress): Observable<boolean> {
    return address && !address.isInactive ? this.canRegisterAddressVisits$ : Observable.of(false);
  }

  get canRegisterSpecialOrOfficeVisit$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [
      DebtService.CONTACT_TYPE_SPECIAL,
      DebtService.CONTACT_TYPE_OFFICE_VISIT
    ]);
  }

  get canRegisterSpecial$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_SPECIAL);
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', DebtService.CONTACT_TYPE_OFFICE_VISIT);
  }

  canRegisterContactForDebt$(debt: { statusCode: number }): Observable<boolean> {
    return Observable.combineLatest(
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

  // navigateToDebtorCard(debtId: number, personId: number): void {
  //   this.contentTabService.removeTabByPath(`\/workplaces\/debt-processing\/(.+)`);
  //   const url = `/workplaces/debt-processing/${personId}/${debtId}`;
  //   this.router.navigate([ url ]);
  // }

  navigateToRegistration(params: Partial<IContactRegistrationParams>): void {
    const { debtId, contactType, contactId, ...queryParams } = params;
    this.contentTabService.removeTabByPath(`\/workplaces\/contact-registration\/(.+)`);
    const url = `/workplaces/contact-registration/${Number(debtId)}/${Number(contactType)}/${Number(contactId)}`;
    this.router.navigate([ url ], { queryParams });
  }

  fetchAll(personId: number): Observable<Array<IDebt>> {
    return this.dataService
      .readAll(this.baseUrl, { personId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback());
  }

  fetch(personId: number, debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { personId, debtId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  create(personId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { personId }, debt)
      .catch(this.notificationsService.createError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  update(personId: number, debtId: number, debt: IDebt): Observable<void> {
    return this.dataService
      .update(this.extUrl, { debtId, personId }, debt)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  changeStatus(personId: number, debtId: number, debt: Partial<IDebt>, callCenter: boolean): Observable<void> {
    return this.dataService
      .update(`${this.extUrl}/statuschange`, { debtId, personId }, debt, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  setNextCallDate(debtId: number, call: IDebtNextCall): Observable<void> {
    return this.dataService
      .update('/debts/{debtId}/nextCall', { debtId }, call)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }
}
