import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContactRegistrationService } from './contact-registration.service';
import { IContactRegistrationMode } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  // @Input('campaignId')
  // set campaignId(campaignId: number) {
  //   this.contactRegistrationService.campaignId = campaignId;
  // }

  // @Input('contactId')
  // set contactId(contactId: number) {
  //   this.contactRegistrationService.contactId = contactId;
  // }

  // @Input('contactType')
  // set contactType(contactType: number) {
  //   this.contactRegistrationService.contactType = contactType;
  // }

  // @Input('debtId')
  // set debtId(debtId: number) {
  //   this.contactRegistrationService.debtId = debtId;
  // }

  // @Input('personId')
  // set personId(personId: number) {
  //   this.contactRegistrationService.personId = personId;
  // }

  // @Input('personRole')
  // set personRole(personRole: number) {
  //   this.contactRegistrationService.personRole = personRole;
  // }

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
