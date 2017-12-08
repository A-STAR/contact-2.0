import { Component } from '@angular/core';

import { INode } from '../../../../shared/gui-objects/container/container.interface';

import { AddressCardComponent } from '../../../../shared/gui-objects/widgets/address/card/address-card.component';

@Component({
  selector: 'app-debtor-address',
  templateUrl: './address.component.html'
})
export class DebtorAddressComponent {
  static COMPONENT_NAME = 'DebtorAddressComponent';

  get node(): INode {
    return {
      component: AddressCardComponent
    };
  }
}
