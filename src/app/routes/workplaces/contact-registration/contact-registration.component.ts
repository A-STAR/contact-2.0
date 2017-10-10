import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  static COMPONENT_NAME = 'ContactRegistrationComponent';

  steps: MenuItem[] = [
    { label: 'Step 1' },
    { label: 'Step 2' },
  ]

  step = 0;

  debtId = this.routeParams.debtId;
  contactTypeCode = this.routeParams.contactTypeCode;

  constructor(private route: ActivatedRoute) {}

  get routeParams(): any {
    return (this.route.params as any).value;
  }
}
