import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';

import { IDebtNextCall, IAddressOrPhone } from './debtor.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { Debt, Person } from '@app/entities';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class DebtorService {

  static CONTACT_TYPE_INCOMING_CALL = 1;
  static CONTACT_TYPE_OUTGOING_CALL = 2;
  static CONTACT_TYPE_ADDRESS_VISIT = 3;
  static CONTACT_TYPE_SPECIAL       = 7;
  static CONTACT_TYPE_OFFICE_VISIT  = 8;

  baseUrl = '/persons/{personId}/debts';
  extUrl = `${this.baseUrl}/{debtId}`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private repo: RepositoryService,
    private userPermissionsService: UserPermissionsService,
    private workplacesService: WorkplacesService,
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

}
