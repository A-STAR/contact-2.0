import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { DebtorService } from '../debtor.service';

import { AddressGridComponent } from '../../../../../shared/gui-objects/widgets/address/grid/address-grid.component';
import { CompanyComponent } from './company/company.component';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { EmailGridComponent } from '../../../../../shared/gui-objects/widgets/email/grid/email-grid.component';
import { PersonComponent } from './person/person.component';
import { PhoneGridComponent } from '../../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent {
  @ViewChild(CompanyComponent) companyComponent: CompanyComponent;
  @ViewChild(PersonComponent) personComponent: PersonComponent;

  node: INode = {
    container: 'tabs',
    children: [
      { component: AddressGridComponent, title: 'debtor.information.address.title', inject: { personRole: 1 } },
      { component: PhoneGridComponent, title: 'debtor.information.phone.title', inject: { personRole: 1, contactType: 1 } },
      { component: EmailGridComponent, title: 'debtor.information.email.title', inject: { personRole: 1 } },
    ]
  };

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
    return this.debtorTypeCode$.map(code => code === 1);
  }

  get isCompany$(): Observable<boolean> {
    return this.debtorTypeCode$.map(code => [2, 3].includes(code));
  }
}
