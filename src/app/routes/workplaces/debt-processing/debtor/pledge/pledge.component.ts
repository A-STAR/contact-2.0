import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { PledgeCardComponent } from '../../../../../shared/gui-objects/widgets/pledge/card/pledge-card.component';

@Component({
  selector: 'app-debtor-pledge',
  templateUrl: './pledge.component.html'
})
export class DebtorPledgeComponent {
  static COMPONENT_NAME = 'DebtorPledgeComponent';

  get node(): INode {
    return {
      component: PledgeCardComponent
    };
  }
}
