import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAddress } from '../../../../../shared/gui-objects/widgets/address/address.interface';
import { IDebt } from '../../../../../shared/gui-objects/widgets/debt/debt/debt.interface';
import { IPhone } from '../../../../../shared/gui-objects/widgets/phone/phone.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../../../../../shared/gui-objects/widgets/debt/debt/debt.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Injectable()
export class RegisterContactService {
  private debt: IDebt;
  // private selectedTabIndex$ = new BehaviorSubject<number>(null);
  // private selectedAddressId$ = new BehaviorSubject<number>(null);
  // private selectedPhoneId$ = new BehaviorSubject<number>(null);

  constructor(
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canRegisterContacts$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 1, 3, 7, 8 ]);
  }

  get canRegisterPhones$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1);
  }

  canRegisterPhone$(phone: IPhone, debtId: number): Observable<boolean> {
    return phone && !phone.isInactive
      ? combineLatestAnd([ this.canRegisterPhones$, this.canRegisterDebt$(debtId) ])
      : Observable.of(false);
  }

  get canRegisterAddresses$(): Observable<boolean> {
    return this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 3);
  }

  canRegisterAddress$(address: IAddress, debtId: number): Observable<boolean> {
    return address && !address.isInactive
      ? combineLatestAnd([ this.canRegisterAddresses$, this.canRegisterDebt$(debtId) ])
      : Observable.of(false);
  }

  get canRegisterMisc$(): Observable<boolean> {
    return this.userPermissionsService.containsOne('DEBT_REG_CONTACT_TYPE_LIST', [ 7, 8 ]);
  }

  navigateToRegistration(personId: number, personRole: number, debtId: number, contactType: number, contactId: number): void {
    this.contentTabService.removeTabByPath(`\/workplaces\/contact-registration(.*)`);
    const url = `/workplaces/contact-registration/${debtId}/${contactType}/${contactId}`;
    this.router.navigate([ url ], { queryParams: { personId, personRole } });
  }

  private canRegisterDebt$(debtId: number): Observable<boolean> {
    return this.fetchDebt$(debtId)
      .flatMap(debt => {
        return this.isDebtActive(debt)
          ? Observable.of(true)
          : this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG');
      });
  }

  private isDebtActive(debt: IDebt): boolean {
    return debt && ![6, 7, 8, 17].includes(debt.statusCode);
  }

  private fetchDebt$(debtId: number): Observable<IDebt> {
    return this.debt && this.debt.id === debtId
      ? Observable.of(this.debt)
      : this.debtService.fetch(null, debtId);
  }
}
