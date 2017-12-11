import { Component } from '@angular/core';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import { IdentityCardComponent } from '../../../../shared/gui-objects/widgets/identity/card/identity-card.component';

@Component({
  selector: 'app-debtor-identity',
  templateUrl: './identity.component.html'
})
export class DebtorIdentityComponent {
  static COMPONENT_NAME = 'DebtorIdentityComponent';

  get node(): INode {
    return {
      component: IdentityCardComponent
    };
  }
}
