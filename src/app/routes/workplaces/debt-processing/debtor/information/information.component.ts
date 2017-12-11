import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '../debtor.service';

import { AddressGridComponent } from './address-grid/address-grid.component';
import { CompanyComponent } from './company/company.component';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { EmailGridComponent } from '../../../../../shared/gui-objects/widgets/email/grid/email-grid.component';
import { PersonComponent } from './person/person.component';
import { PhoneGridComponent } from './phone-grid/phone-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent {
  @ViewChild(CompanyComponent) companyComponent: CompanyComponent;
  @ViewChild(PersonComponent) personComponent: PersonComponent;

  tabs = [
    { component: AddressGridComponent, title: 'debtor.information.address.title', isInitialised: true },
    { component: PhoneGridComponent, title: 'debtor.information.phone.title', isInitialised: false },
    {
      component: EmailGridComponent,
      title: 'debtor.information.email.title',
      inject: { personRole: 1 },
      isInitialised: false
    },
  ];

  constructor(
    private debtorService: DebtorService,
  ) {}

  get form(): DynamicFormComponent {
    const component = this.companyComponent || this.personComponent;
    return component && component.form;
  }

  get debtorTypeCode$(): Observable<number> {
    return this.debtorService.debtor$.map(debtor => debtor && debtor.typeCode);
  }

  get isPerson$(): Observable<boolean> {
    return this.debtorService.isPerson$;
  }

  get isCompany$(): Observable<boolean> {
    return this.debtorService.isCompany$;
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
