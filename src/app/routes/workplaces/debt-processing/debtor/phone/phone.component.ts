import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { PhoneCardComponent } from '../../../../../shared/gui-objects/widgets/phone/card/phone-card.component';

@Component({
  selector: 'app-debtor-phone',
  templateUrl: './phone.component.html'
})
export class DebtorPhoneComponent {
  get node(): INode {
    return {
      component: PhoneCardComponent
    };
  }
}
