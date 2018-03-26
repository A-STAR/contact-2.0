import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { IContactPersonRequest, INewContactPerson } from '../contact-select/contact-select.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { ContactSelectComponent } from '../contact-select/contact-select.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-phone',
  templateUrl: 'phone.component.html'
})
export class ContactRegistrationPhoneComponent {
  @Input() formGroup: FormGroup;

  @ViewChild(ContactSelectComponent) contactForPhone: ContactSelectComponent;

  phoneTypeDictCode = UserDictionariesService.DICTIONARY_PHONE_TYPE;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get person(): IContactPersonRequest | INewContactPerson {
    return this.contactForPhone && this.contactForPhone.person;
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.addPhone === 1),
    );
  }
}
