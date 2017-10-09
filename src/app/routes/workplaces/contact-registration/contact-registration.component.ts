import { Component } from '@angular/core';

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
}
