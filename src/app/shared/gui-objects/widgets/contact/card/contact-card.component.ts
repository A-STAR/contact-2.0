import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IAddress } from '@app/routes/workplaces/shared/address/address.interface';
import { IContact } from '@app/shared/gui-objects/widgets/contact/contact.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';

import { ContactService } from '@app/shared/gui-objects/widgets/contact/contact.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.contact.grid');

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

  tabs = [
    { title: 'debtor.information.phone.title', isInitialised: true },
    { title: 'debtor.information.address.title', isInitialised: true },
    { title: 'debtor.identityDocs.title', isInitialised: false },
    { title: 'debtor.employmentRecordTab.title', isInitialised: false }
  ];

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
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
        { label: label('lastName'), controlName: 'lastName', type: 'text', width: 4, required: true },
        { label: label('firstName'), controlName: 'firstName', type: 'text', width: 4 },
        { label: label('middleName'), controlName: 'middleName', type: 'text', width: 4 },
        { label: label('birthDate'), controlName: 'birthDate',  type: 'datepicker', width: 4 },
        { label: label('genderCode'), controlName: 'genderCode', type: 'select', width: 4, options: genderOptions },
        { label: label('birthPlace'), controlName: 'birthPlace',  type: 'text', width: 4 },
        {
          label: label('familyStatusCode'),
          controlName: 'familyStatusCode',
          type: 'select',
          width: 4,
          options: familyOptions
        },
        { label: label('educationCode'), controlName: 'educationCode',  type: 'select', width: 4, options: educationOptions },
        { label: label('linkTypeCode'), controlName: 'linkTypeCode',  type: 'select', width: 4, options: cTypeOptions },
        { label: label('comment'), controlName: 'comment', type: 'textarea', },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true });
      this.contact = contact;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get debtorId(): number {
    return this.routeParams.personId;
  }

  get contactPersonId(): number {
    return this.routeParams.contactId || this.routeParams.personId;
  }

  onAddressAdd(): void {
    this.routingService.navigate([ 'address/create' ], this.route);
  }

  onAddressEdit(address: IAddress): void {
    this.routingService.navigate([ `address/${address.id}` ], this.route);
  }

  onPhoneAdd(): void {
    this.routingService.navigate([ 'phone/create' ], this.route);
  }

  onPhoneEdit(phone: IPhone): void {
    this.routingService.navigate([ `phone/${phone.id}` ], this.route);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onBack(): void {
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId')
    ]);
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

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
