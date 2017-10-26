import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { PropertyCardComponent } from '../../../../../shared/gui-objects/widgets/property/card/property-card.component';

@Component({
  selector: 'app-debtor-property',
  templateUrl: './property.component.html'
})
export class DebtorPropertyComponent {
  static COMPONENT_NAME = 'DebtorPropertyComponent';

  get node(): INode {
    return {
      component: PropertyCardComponent
    };
  }
}
