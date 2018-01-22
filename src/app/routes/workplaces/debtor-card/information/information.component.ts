import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { IDebt } from '../../../../core/app-modules/app-modules.interface';
import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { CompanyComponent } from './company/company.component';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { PersonComponent } from './person/person.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent {
  @ViewChild(CompanyComponent) companyComponent: CompanyComponent;
  @ViewChild(PersonComponent) personComponent: PersonComponent;

  tabs = [
    { title: 'debtor.information.address.title', isInitialised: true },
    { title: 'debtor.information.phone.title', isInitialised: false },
    { title: 'debtor.information.email.title', isInitialised: false },
  ];

  constructor(
    private debtorCardService: DebtorCardService,
    private router: Router,
    private routingService: RoutingService,
  ) {}

  get debt$(): Observable<IDebt> {
    return this.debtorCardService.selectedDebt$;
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }

  get form(): DynamicFormComponent {
    const component = this.companyComponent || this.personComponent;
    return component && component.form;
  }

  get debtorTypeCode$(): Observable<number> {
    return this.debtorCardService.person$.map(person => person && person.typeCode);
  }

  get isPerson$(): Observable<boolean> {
    return this.debtorCardService.isPerson$;
  }

  get isCompany$(): Observable<boolean> {
    return this.debtorCardService.isCompany$;
  }

  get contactType(): number {
    return 1;
  }

  get personRole(): number {
    return 1;
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onAddressAdd(): void {
    this.routingService.navigate([ 'address', 'create' ]);
  }

  onAddressEdit(address: IAddress): void {
    this.routingService.navigate([ 'address', `${address.id}` ]);
  }

  onAddressRegister(address: IAddress): void {
    combineLatest(this.personId$, this.debtId$)
      .pipe(first())
      .subscribe(([ personId, debtId ]) => {
        const url = `/workplaces/contact-registration/${debtId}/3/${address.id}`;
        this.router.navigate([ url ], { queryParams: {
          personId: personId,
          personRole: this.personRole,
        } });
      });
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone', 'create' ]);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ 'phone', `${phone.id}` ]);
  }

  onPhoneRegister(phone: IPhone): void {
    combineLatest(this.personId$, this.debtId$)
      .pipe(first())
      .subscribe(([ personId, debtId ]) => {
        const url = `/workplaces/contact-registration/${debtId}/${this.contactType}/${phone.id}`;
        this.router.navigate([ url ], { queryParams: {
          personId: personId,
          personRole: this.personRole,
        } });
      });
  }
}
