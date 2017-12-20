import { Component, Input, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IContact } from '../contact.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContactService } from '../contact.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { AddressGridComponent } from './address-grid/address-grid.component';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { EmploymentGridComponent } from '../../../../../shared/gui-objects/widgets/employment/grid/employment-grid.component';
import { IdentityGridComponent } from '../../../../../shared/gui-objects/widgets/identity/grid/identity-grid.component';
import { PhoneGridComponent } from './phone-grid/phone-grid.component';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.contact.grid');

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html'
})
export class ContactCardComponent {
  @Input() contactId: number;
  @Input() personId: number;

  @ViewChild('form') form: DynamicFormComponent;

  controls: IDynamicFormControl[] = null;
  contact: IContact;

  // TODO(d.maltsev) get rid of this. Use widgets in html instead.
  node: INode = {
    container: 'tabs',
    children: [
      {
        component: PhoneGridComponent,
        title: 'debtor.information.phone.title',
      },
      {
        component: AddressGridComponent,
        title: 'debtor.information.address.title'
      },
      {
        component: IdentityGridComponent,
        title: 'debtor.identityDocs.title',
        inject: { personRole: 4 }
      },
      {
        component: EmploymentGridComponent,
        title: 'debtor.employmentRecordTab.title',
        inject: { personRole: 4 }
      },
    ]
  };

  constructor(
    private contentTabService: ContentTabService,
    private contactService: ContactService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_GENDER,
        UserDictionariesService.DICTIONARY_FAMILY_STATUS,
        UserDictionariesService.DICTIONARY_EDUCATION,
        UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE,
      ]),
      this.contactId
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.contactId ? this.contactService.fetch(this.personId, this.contactId) : of(null)
    )
    .pipe(first())
    .subscribe(([ options, canEdit, contact ]) => {
      const genderOptions = options[UserDictionariesService.DICTIONARY_GENDER];
      const familyOptions = options[UserDictionariesService.DICTIONARY_FAMILY_STATUS];
      const educationOptions = options[UserDictionariesService.DICTIONARY_EDUCATION];
      const cTypeOptions = options[UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE];
      const controls: IDynamicFormControl[] = [
        { label: labelKey('lastName'), controlName: 'lastName', type: 'text', width: 4, required: true },
        { label: labelKey('firstName'), controlName: 'firstName', type: 'text', width: 4 },
        { label: labelKey('middleName'), controlName: 'middleName', type: 'text', width: 4 },
        { label: labelKey('birthDate'), controlName: 'birthDate',  type: 'datepicker', width: 4 },
        { label: labelKey('genderCode'), controlName: 'genderCode', type: 'select', width: 4, options: genderOptions },
        { label: labelKey('birthPlace'), controlName: 'birthPlace',  type: 'text', width: 4 },
        {
          label: labelKey('familyStatusCode'),
          controlName: 'familyStatusCode',
          type: 'select',
          width: 4,
          options: familyOptions
        },
        { label: labelKey('educationCode'), controlName: 'educationCode',  type: 'select', width: 4, options: educationOptions },
        { label: labelKey('linkTypeCode'), controlName: 'linkTypeCode',  type: 'select', width: 4, options: cTypeOptions },
        { label: labelKey('comment'), controlName: 'comment', type: 'textarea', },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true });
      this.contact = contact;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.contactId
      ? this.contactService.update(this.personId, this.contactId, data)
      : this.contactService.create(this.personId, data);

    action.subscribe(() => {
      this.contactService.dispatchAction(ContactService.MESSAGE_CONTACT_SAVED);
      this.onBack();
    });
  }
}
