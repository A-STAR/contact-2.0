import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IContact } from '../contact.interface';
import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContactService } from '../contact.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { PersonSelectComponent } from 'app/shared/gui-objects/widgets/person-select/select/person-select.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.contact.grid');

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html'
})
export class ContactCardComponent implements OnInit {
  @Input() contactId: number;
  @Input() personId: number;

  @ViewChild(DynamicFormComponent) personForm: DynamicFormComponent;
  @ViewChild(DynamicFormComponent) personSelect: PersonSelectComponent;

  controls: IDynamicFormControl[] = null;
  contact: IContact;

  tabs = [
    { title: 'debtor.information.phone.title', isInitialised: true },
    { title: 'debtor.information.address.title', isInitialised: true },
    { title: 'debtor.identityDocs.title', isInitialised: false },
    { title: 'debtor.employmentRecordTab.title', isInitialised: false }
  ];

  constructor(
    private contentTabService: ContentTabService,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
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

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    this.serializedUpdates.subscribe(data => {
      const action = this.contactId
        ? this.contactService.update(this.personId, this.contactId, data)
        : this.contactService.create(this.personId, data);

      action.subscribe(() => {
        this.contactService.dispatchAction(ContactService.MESSAGE_CONTACT_SAVED);
        this.onBack();
      });
    });
  }

  private get form(): DynamicFormComponent | PersonSelectComponent {
    return this.personForm || this.personSelect;
  }

  private get serializedUpdates(): Observable<IContact> {
    return this.personForm
      ? of(this.personForm.serializedUpdates)
      : this.personSelect.selectedPerson;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
