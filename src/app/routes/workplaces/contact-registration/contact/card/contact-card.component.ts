import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { IContactPerson } from '../contact-grid.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from 'app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.contactGrid.card');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-card',
  templateUrl: 'contact-card.component.html'
})
export class ContactCardComponent implements AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [
    { controlName: 'lastName', type: 'text', required: true },
    { controlName: 'firstName', type: 'text' },
    { controlName: 'middleName', type: 'text' },
    { controlName: 'personTypeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { controlName: 'linkTypeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(control => ({ ...control, label: labelKey(control.controlName) } as IDynamicFormControl));

  data = {
    personTypeCode: 1,
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.form.getControl('personTypeCode').markAsDirty();
  }

  get isDisabled(): boolean {
    return !this.form.canSubmit;
  }
}
