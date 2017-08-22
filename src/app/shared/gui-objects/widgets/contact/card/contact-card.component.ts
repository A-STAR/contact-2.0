import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IContact } from '../contact.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContactService } from '../contact.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html'
})
export class ContactCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private personId = (this.route.params as any).value.id || null;
  private contactId = (this.route.params as any).value.contactId || null;

  controls: IDynamicFormControl[] = null;
  contact: IContact;

  constructor(
    private contentTabService: ContentTabService,
    private contactService: ContactService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_GENDER,
        UserDictionariesService.DICTIONARY_FAMILY_STATUS,
        UserDictionariesService.DICTIONARY_EDUCATION,
      ]),
      this.contactId
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.contactId ? this.contactService.fetch(this.personId, this.contactId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, canEdit, contact ]) => {
      const controls: IDynamicFormControl[] = [
        { label: 'widgets.contact.grid.firstName', controlName: 'firstName', type: 'text' },
        { label: 'widgets.contact.grid.middleName', controlName: 'middleName', type: 'text' },
        { label: 'widgets.contact.grid.lastName', controlName: 'lastName', type: 'text', required: true },
        { label: 'widgets.contact.grid.birthDate', controlName: 'birthDate',  type: 'datepicker' },
        { label: 'widgets.contact.grid.birthPlace', controlName: 'birthPlace',  type: 'text', },
        { label: 'widgets.contact.grid.genderCode', controlName: 'genderCode', type: 'number', },
        { label: 'widgets.contact.grid.familyStatusCode', controlName: 'familyStatusCode', type: 'number', },
        { label: 'widgets.contact.grid.educationCode', controlName: 'educationCode',  type: 'number', },
        { label: 'widgets.contact.grid.linkTypeCode', controlName: 'linkTypeCode',  type: 'number', },
        { label: 'widgets.contact.grid.comment', controlName: 'comment', type: 'textarea', },
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
    const data = this.form.requestValue;
    const action = this.contactId
      ? this.contactService.update(this.personId, this.contactId, data)
      : this.contactService.create(this.personId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(ContactService.MESSAGE_CONTACT_SAVED);
      this.onBack();
    });
  }
}
