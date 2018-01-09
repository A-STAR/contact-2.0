import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDebt } from '../../../../core/app-modules/app-modules.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

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

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
