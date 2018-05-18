import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IPhone } from '@app/routes/workplaces/core/phone/phone.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { CompanyComponent } from '@app/routes/workplaces/debtor-card/information/company/company.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { PersonComponent } from '@app/routes/workplaces/debtor-card/information/person/person.component';

import { Debt } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent {
  @ViewChild(CompanyComponent) companyComponent: CompanyComponent;
  @ViewChild(PersonComponent) personComponent: PersonComponent;

  tabs = [
    { title: 'debtor.information.phone.title', isInitialised: false },
    { title: 'debtor.information.address.title', isInitialised: true },
    { title: 'debtor.information.email.title', isInitialised: false },
  ];

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  readonly debt$: Observable<Debt> = this.debtorService.debt$;

  readonly debtId$: Observable<number> = this.debtorService.debtId$;

  readonly debtorId$: Observable<number> = this.debtorService.debtorId$;

  get form(): DynamicFormComponent {
    const component = this.companyComponent || this.personComponent;
    return component && component.form;
  }

  readonly debtorTypeCode$: Observable<number> = this.debtorService.debtor$.map(debtor => debtor && debtor.typeCode);

  readonly isPerson$: Observable<boolean> = this.debtorService.isPerson$;

  readonly isCompany$: Observable<boolean> = this.debtorService.isCompany$;

  readonly phoneContactType = 1;

  readonly personRole = 1;

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onAddressAdd(): void {
    this.routingService.navigate([ 'address/create' ], this.route);
  }

  onAddressEdit(address: IAddress): void {
    this.routingService.navigate([ `address/${address.id}` ], this.route);
  }

  onAddressRegister(address: IAddress): void {
    combineLatest(this.debtorId$, this.debtId$)
      .pipe(first())
      .subscribe(([ personId, debtId ]) => this.contactRegistrationService.startRegistration({
        contactId: address.id,
        contactType: 3,
        debtId,
        personId,
        personRole: this.personRole,
      }));
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone/create' ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ `phone/${phone.id}` ], this.route);
  }

  onPhoneRegister(phone: IPhone): void {
    combineLatest(this.debtorId$, this.debtId$)
      .pipe(first())
      .subscribe(([ personId, debtId ]) => this.contactRegistrationService.startRegistration({
        contactId: phone.id,
        contactType: this.phoneContactType,
        debtId,
        personId,
        personRole: this.personRole,
      }));
  }
}
