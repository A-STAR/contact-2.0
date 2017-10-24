import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { PromiseCardComponent } from '../../../../../shared/gui-objects/widgets/promise/card/promise-card.component';

@Component({
  selector: 'app-debtor-promise',
  templateUrl: './promise.component.html'
})
export class DebtorPromiseComponent {
  static COMPONENT_NAME = 'DebtorPromiseComponent';

  get node(): INode {
    return {
      component: PromiseCardComponent
    };
  }
}
