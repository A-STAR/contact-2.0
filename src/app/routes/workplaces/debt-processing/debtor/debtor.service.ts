import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAddress } from '../../../../shared/gui-objects/widgets/address/address.interface';
import { IDebt } from '../debt-processing.interface';
import { IPerson } from './debtor.interface';
import { IPhone } from '../../../../shared/gui-objects/widgets/phone/phone.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class DebtorService {
  private _debt$ = new BehaviorSubject<IDebt>(null);
  private _debtor$ = new BehaviorSubject<IPerson>(null);

  constructor(
    private contentTabService: ContentTabService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.preloadDebt(this.debtId).subscribe(debt => {
      this.preloadDebtor(debt.personId).subscribe();
    });
  }

  get canRegisterPhones$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1);
  }

  canRegisterPhone$(phone: IPhone): Observable<boolean> {
    return phone && !phone.isInactive ? this.canRegisterPhones$ : Observable.of(false);
  }

  get canRegisterAddresses$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 3);
  }

  canRegisterAddress$(address: IAddress): Observable<boolean> {
    return address && !address.isInactive ? this.canRegisterAddresses$ : Observable.of(false);
  }

  get canRegisterMisc$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 7, 8 ]);
  }

  get canRegisterSpecial$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 7);
  }

  get canRegisterOfficeVisit$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 8);
  }

  navigateToRegistration(personId: number, personRole: number, contactType: number, contactId: number): void {
    const debtId = this._debt$.value.id;
    this.contentTabService.removeTabByPath(`\/workplaces\/contact-registration(.*)`);
    const url = `/workplaces/contact-registration/${debtId}/${contactType}/${contactId}`;
    this.router.navigate([ url ], { queryParams: { personId, personRole } });
  }

  get debt$(): Observable<IDebt> {
    return this._debt$
      .filter(Boolean);
  }

  get debtor$(): Observable<IPerson> {
    return this._debtor$
      .filter(Boolean);
  }

  get isPerson$(): Observable<boolean> {
    return this.debtor$.map(debtor => debtor && debtor.typeCode === 1);
  }

  get isCompany$(): Observable<boolean> {
    return this.debtor$.map(debtor => debtor && [2, 3].includes(debtor.typeCode));
  }

  update(person: IPerson): Observable<void> {
    const debtorId = this._debtor$.value.id;
    return this.dataService
      .update('/persons/{debtorId}', { debtorId }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  get canRegisterDebt$(): Observable<boolean> {
    return Observable.combineLatest(
      this.debt$,
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG'),
      this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 1, 3, 7, 8 ]),
    ).map(([ debt, canRegisterClosed, canRegister ]) => (this.isDebtActive(debt) || canRegisterClosed) && canRegister);
  }

  private isDebtActive(debt: { statusCode: number }): boolean {
    return debt && ![6, 7, 8, 17].includes(debt.statusCode);
  }

  private preloadDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .do((debt: IDebt) => {
        this._debt$.next(debt);
      });
  }

  private preloadDebtor(debtorId: number): Observable<IPerson> {
    return this.dataService
      .read('/persons/{debtorId}', { debtorId })
      .do((debtor: IPerson) => {
        this._debtor$.next(debtor);
      });
  }

  private get debtId(): number {
    return this.routeParams.debtId;
  }

  private get routeParams(): { [key: string]: number } {
    return (this.route.params as any).value;
  }
}
