import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { AddressCardComponent } from '../../../../../shared/gui-objects/widgets/address/card/address-card.component';

@Component({
  selector: 'app-debtor-address',
  templateUrl: './address.component.html'
})
export class DebtorAddressComponent {
  private addressId: number;

  constructor(private route: ActivatedRoute) {
    this.addressId = (route.params as any).value.addressId;
  }

  get node(): INode {
    return {
      component: AddressCardComponent,
      key: 'debtorAddressCard',
      inject: {
        id: this.addressId
      }
    };
  }
}
