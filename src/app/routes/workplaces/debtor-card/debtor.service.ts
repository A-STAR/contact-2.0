import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, switchMap, map, distinctUntilChanged, catchError } from 'rxjs/operators';

import { equals } from 'ramda';

import { Debt, Person } from '@app/entities';
import { IDebtNextCall, IAddressOrPhone } from './debtor.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';
import { LayoutService } from '@app/core/layout/layout.service';

@Injectable()
export class DebtorService {

  static CONTACT_TYPE_INCOMING_CALL = 1;
  static CONTACT_TYPE_OUTGOING_CALL = 2;
  static CONTACT_TYPE_ADDRESS_VISIT = 3;
  static CONTACT_TYPE_SPECIAL       = 7;
  static CONTACT_TYPE_OFFICE_VISIT  = 8;

  baseUrl = '/persons/{personId}/debts';
  extUrl = `${this.baseUrl}/{debtId}`;

  private _lastDebtors = new Map<number, number>();
  private _debtors = new Map<number, number>();
  debtors$ = new BehaviorSubject<Array<[number, number]>>([]);

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private repo: RepositoryService,
    private userPermissionsService: UserPermissionsService,
    private workplacesService: WorkplacesService,
    private layoutService: LayoutService
  ) {}

  readonly debtId$ = new BehaviorSubject<number>(null);
  readonly debtorId$ = new BehaviorSubject<number>(null);
  readonly entityTypeId$ = new BehaviorSubject<number>(null);

  readonly debtor$ = this.debtorId$
    .pipe(
      filter(Boolean),
      switchMap(debtorId => this.workplacesService.fetchDebtor(debtorId)),
    );

  readonly debt$ = this.debtId$
    .pipe(
      filter(Boolean),
      switchMap(debtId => this.workplacesService.fetchDebt(debtId)),
    );

  readonly debts$ = this.debtorId$
    .pipe(
      filter(Boolean),
      switchMap(debtorId => this.workplacesService.fetchDebtsForPerson(debtorId)),
      distinctUntilChanged(equals),
    );

  readonly isCompany$ = this.debtor$
    .pipe(
      filter(Boolean),
      map(debtor => [2, 3].includes(debtor.typeCode)),
      distinctUntilChanged()
    );

  readonly isPerson$ = this.debtor$
    .pipe(
      filter(Boolean),
      map(debtor => debtor.typeCode === 1),
      distinctUntilChanged()
    );

  readonly canRegisterSpecial$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtorService.CONTACT_TYPE_SPECIAL);

  readonly canRegisterSpecialOrOfficeVisit$ = this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [
    DebtorService.CONTACT_TYPE_SPECIAL,
    DebtorService.CONTACT_TYPE_OFFICE_VISIT
  ]);

  readonly canRegisterAddressVisits$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtorService.CONTACT_TYPE_ADDRESS_VISIT);

  readonly canRegisterIncomingCalls$ = this.userPermissionsService
    .contains('DEBT_REG_CONTACT_TYPE_LIST', DebtorService.CONTACT_TYPE_INCOMING_CALL);

  canRegisterContactForDebt$(debt: { statusCode: number }): Observable<boolean> {
    return combineLatest(
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG'),
      this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [
        DebtorService.CONTACT_TYPE_INCOMING_CALL,
        DebtorService.CONTACT_TYPE_ADDRESS_VISIT,
        DebtorService.CONTACT_TYPE_SPECIAL,
        DebtorService.CONTACT_TYPE_OFFICE_VISIT,
      ]),
    ).pipe(
      map(([ canRegisterClosed, canRegister ]) =>
        (this.workplacesService.isDebtActive(debt) || canRegisterClosed) && canRegister)
    );
  }

  canRegisterAddressVisit$(address: IAddressOrPhone): Observable<boolean> {
    return address && !address.isInactive ? this.canRegisterAddressVisits$ : of(false);
  }

  canRegisterIncomingCall$(phone: IAddressOrPhone): Observable<boolean> {
    return phone && !phone.isInactive ? this.canRegisterIncomingCalls$ : of(false);
  }

  refreshDebts(): void {
    if (this.debtorId$.value) {
      this.repo.refresh(Debt, { personId: this.debtorId$.value });
    }
  }

  setNextCallDate(debtId: number, call: IDebtNextCall): Observable<void> {
    return this.dataService
      .update('/debts/{debtId}/nextCall', { debtId }, call)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  createDebt(debt: Partial<Debt>): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { personId: this.debtorId$.value }, debt)
      .catch(this.notificationsService.createError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  updateDebt(debt: Partial<Debt>): Observable<void> {
    return this.dataService
      .update(this.extUrl, { debtId: this.debtId$.value, personId: this.debtorId$.value }, debt)
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  updateDebtor(debtor: Partial<Person>): Observable<void> {
    return this.dataService.update('/persons/{id}', { id: this.debtorId$.value }, debtor)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback())
      );
  }

  openTab(debtorId: number, debtId: number): void {

    const isDebt = this._debtors.get(debtorId) === debtId;

    if (!isDebt) {
      this.addTab(debtorId, debtId);
    }

    this.addLastDebtor(debtorId, debtId);

  }

  removeTab(debtorId: number): void {
    this._debtors.delete(debtorId);
    this.debtors$.next(this.debtors);

    this._lastDebtors.delete(debtorId);
    this.layoutService.lastDebtors$.next(this.lastDebtors);
  }

  closeCard(debtId: number): Observable<void> {
    return this.dataService.create('/pbx/debt/{debtId}/closeCard', { debtId }, {})
      .pipe(
        catchError(this.notificationsService.error('debt.close.error').dispatchCallback()),
      );
  }

  private addTab(debtorId: number, debtId: number): void {
    this._debtors.set(debtorId, debtId);
    this.debtors$.next(this.debtors);
  }

  private addLastDebtor(debtorId: number, debtId: number): void {

    const hasDebtor = this._lastDebtors.has(debtorId);

    if (hasDebtor) {
      this._lastDebtors.delete(debtorId);
    }

    this._lastDebtors.set(debtorId, debtId);

    this.layoutService.lastDebtors$.next(this.lastDebtors);
  }

  get lastDebtors(): Array<[number, number]> {
    return Array.from(this._lastDebtors as Map<number, number>);
  }

  private get debtors(): Array<[number, number]> {
    return Array.from(this._debtors as Map<number, number>);
  }

}
