import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { EmailCardComponent } from '../../../../../shared/gui-objects/widgets/email/card/email-card.component';

@Component({
  selector: 'app-debtor-email',
  templateUrl: './email.component.html'
})
export class DebtorEmailComponent {
  get node(): INode {
    return {
      component: EmailCardComponent
    };
  }
}
