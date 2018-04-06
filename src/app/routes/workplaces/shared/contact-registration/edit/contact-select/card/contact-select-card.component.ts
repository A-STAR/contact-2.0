import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('routes.workplaces.shared.contactRegistration.edit.form.contactSelect.card.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-select-card',
  templateUrl: 'contact-select-card.component.html'
})
export class ContactSelectCardComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [
    { controlName: 'lastName', type: 'text', required: true },
    { controlName: 'firstName', type: 'text' },
    { controlName: 'middleName', type: 'text' },
    {
      controlName: 'personTypeCode',
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
      required: true,
      type: 'select',
    },
    {
      controlName: 'linkTypeCode',
      type: 'select',
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE
    },
  ].map(control => ({ ...control, label: labelKey(control.controlName) } as IDynamicFormControl));

  data = {
    personTypeCode: 1,
  };

  get isValid(): boolean {
    return this.form.canSubmit;
  }

  get person(): any {
    return this.form.serializedValue;
  }
}
