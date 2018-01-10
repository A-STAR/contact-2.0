import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson, PersonSelectorComponent, ISelectedPerson } from '../person-select.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { PersonSelectService } from '../person-select.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.contactGrid.tabs.add.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-card',
  templateUrl: './person-select-card.component.html'
})
export class PersonSelectCardComponent implements PersonSelectorComponent {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [
    { controlName: 'lastName', type: 'text', required: true },
    { controlName: 'firstName', type: 'text' },
    { controlName: 'middleName', type: 'text' },
    {
      controlName: 'typeCode',
      label: labelKey('personTypeCode'),
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
      markAsDirty: true,
      required: true,
      type: 'selectwrapper',
    },
    { controlName: 'linkTypeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(control => ({ label: labelKey(control.controlName), ...control } as IDynamicFormControl));

  data: any = {
    typeCode: 1,
  };

  constructor(private personSelectService: PersonSelectService) { }

  get isValid(): boolean {
    return this.form.canSubmit;
  }

  set value(person: IPerson) {
    this.data = person;
  }

  get person(): Observable<ISelectedPerson> {
    return this.personSelectService.create(this.form.serializedUpdates)
      .map(personId => ({ id: personId, ...this.form.serializedValue }));
  }
}
