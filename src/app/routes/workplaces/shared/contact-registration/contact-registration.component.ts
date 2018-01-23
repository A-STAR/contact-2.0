import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactRegistrationService } from './contact-registration.service';
import { IContactRegistrationMode } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get showEdit(): boolean {
    return this.contactRegistrationService.mode === IContactRegistrationMode.EDIT;
  }

  get showTree(): boolean {
    return this.contactRegistrationService.mode === IContactRegistrationMode.TREE;
  }
}
