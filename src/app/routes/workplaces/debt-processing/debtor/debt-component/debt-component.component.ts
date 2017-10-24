import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import {
  DebtComponentCardComponent
} from '../../../../../shared/gui-objects/widgets/debt/component/card/debt-component-card.component';

@Component({
  selector: 'app-debtor-address',
  templateUrl: './debt-component.component.html'
})
export class DebtorDebtComponentComponent {
  static COMPONENT_NAME = 'DebtorDebtComponentComponent';

  get node(): INode {
    return {
      component: DebtComponentCardComponent
    };
  }
}
