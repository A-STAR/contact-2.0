import { Component } from '@angular/core';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import { ContactCardComponent } from '../../../../shared/gui-objects/widgets/contact/card/contact-card.component';

@Component({
  selector: 'app-debtor-contacts',
  templateUrl: './contacts.component.html'
})
export class DebtorContactsComponent {
  static COMPONENT_NAME = 'DebtorContactsComponent';

  get node(): INode {
    return {
      component: ContactCardComponent
    };
  }
}
