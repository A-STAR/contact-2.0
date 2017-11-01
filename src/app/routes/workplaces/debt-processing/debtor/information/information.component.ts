import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { AddressGridComponent } from '../../../../../shared/gui-objects/widgets/address/grid/address-grid.component';
import { EmailGridComponent } from '../../../../../shared/gui-objects/widgets/email/grid/email-grid.component';
import { PersonComponent } from './person/person.component';
import { PhoneGridComponent } from '../../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-information',
  templateUrl: './information.component.html',
})
export class DebtorInformationComponent {
  @Input() person: any;
  @ViewChild(PersonComponent) personComponent: PersonComponent;

  node: INode = {
    container: 'tabs',
    children: [
      { component: AddressGridComponent, title: 'debtor.information.address.title', inject: { personRole: 1 } },
      { component: PhoneGridComponent, title: 'debtor.information.phone.title', inject: { personRole: 1, contactType: 1 } },
      { component: EmailGridComponent, title: 'debtor.information.email.title', inject: { personRole: 1 } },
    ]
  };

  get form(): any {
    return this.personComponent.form;
  }
}
