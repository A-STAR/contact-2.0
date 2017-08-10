import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { DebtCardComponent } from '../../../../../shared/gui-objects/widgets/debt/debt/card/debt-card.component';

@Component({
  selector: 'app-debtor-address',
  templateUrl: './debt.component.html'
})
export class DebtorDebtComponent {
  static COMPONENT_NAME = 'DebtorDebtComponent';

  get node(): INode {
    return {
      component: DebtCardComponent
    };
  }
}
