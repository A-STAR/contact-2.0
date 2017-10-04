import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { GuarantorCardComponent } from '../../../../../shared/gui-objects/widgets/guarantor/card/guarantor-card.component';

@Component({
  selector: 'app-debtor-guarantor',
  templateUrl: './guarantor.component.html'
})
export class DebtorGuarantorComponent {
  static COMPONENT_NAME = 'DebtorGuarantorComponent';

  get node(): INode {
    return {
      component: GuarantorCardComponent
    };
  }
}
