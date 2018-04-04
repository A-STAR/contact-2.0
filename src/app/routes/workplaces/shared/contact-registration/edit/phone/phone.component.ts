import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IContactPersonRequest, INewContactPerson } from '../contact-select/contact-select.interface';

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

  constructor() {}

  get person(): IContactPersonRequest | INewContactPerson {
    return this.contactForPhone && this.contactForPhone.person;
  }
}
