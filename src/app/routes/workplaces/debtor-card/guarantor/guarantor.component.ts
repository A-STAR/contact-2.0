import { Component } from '@angular/core';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import { GuaranteeCardComponent } from '../../../../shared/gui-objects/widgets/guarantee/card/guarantee-card.component';

@Component({
  selector: 'app-debtor-guarantor',
  templateUrl: './guarantor.component.html'
})
export class DebtorGuarantorComponent {
  static COMPONENT_NAME = 'DebtorGuarantorComponent';

  get node(): INode {
    return {
      component: GuaranteeCardComponent
    };
  }
}
