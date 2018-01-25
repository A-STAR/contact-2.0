import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactPersonRequest, INewContactPerson } from '../contact-select/contact-select.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

import { ContactSelectComponent } from '../contact-select/contact-select.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-phone',
  templateUrl: 'phone.component.html'
})
export class ContactRegistrationPhoneComponent {
  @ViewChild(ContactSelectComponent) contactForPhone: ContactSelectComponent;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get person(): IContactPersonRequest | INewContactPerson {
    return this.contactForPhone.person;
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPhone$;
  }
}
