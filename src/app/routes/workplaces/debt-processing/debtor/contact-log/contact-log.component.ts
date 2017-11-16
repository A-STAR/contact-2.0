import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import {
  ContactLogCardComponent
} from '../../../../../shared/gui-objects/widgets/contact-log/card/contact-log-card.component';

@Component({
  selector: 'app-contact-log',
  templateUrl: './contact-log.component.html'
})
export class DebtorContactLogComponent {
  static COMPONENT_NAME = 'DebtorContactLogComponent';

  get node(): INode {
    return {
      component: ContactLogCardComponent
    };
  }
}
