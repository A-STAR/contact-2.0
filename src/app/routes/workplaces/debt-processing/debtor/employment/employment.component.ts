import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { EmploymentCardComponent } from '../../../../../shared/gui-objects/widgets/employment/card/employment-card.component';

@Component({
  selector: 'app-debtor-employment',
  templateUrl: './employment.component.html'
})
export class DebtorEmploymentComponent {
  static COMPONENT_NAME = 'DebtorEmploymentComponent';

  get node(): INode {
    return {
      component: EmploymentCardComponent
    };
  }
}
