import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import {
  ContactLogTabCardComponent
} from '../../../../../shared/gui-objects/widgets/contact-log-tab/card/contact-log-card.component';

@Component({
  selector: 'app-contact-log-tab',
  templateUrl: './contact-log-tab.component.html'
})
export class DebtorContactLogTabComponent {
  static COMPONENT_NAME = 'DebtorContactLogTabComponent';

  get node(): INode {
    return {
      component: ContactLogTabCardComponent
    };
  }
}
