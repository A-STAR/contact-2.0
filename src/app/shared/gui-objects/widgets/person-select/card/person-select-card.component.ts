import { ChangeDetectionStrategy, Component, ViewChild, Input, OnInit } from '@angular/core';
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
export class PersonSelectCardComponent implements OnInit, PersonSelectorComponent {

  @Input() person: IPerson;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(private personSelectService: PersonSelectService) { }

  ngOnInit(): void {
    this.controls = [
      { controlName: 'lastName', type: 'text', required: true },
      { controlName: 'firstName', type: 'text' },
      { controlName: 'middleName', type: 'text' },
      {
        controlName: 'typeCode',
        label: labelKey('personTypeCode'),
        dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
        markAsDirty: !this.person,
        required: true,
        type: 'selectwrapper',
      },
      { controlName: 'linkTypeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
    ].map(control => ({ label: labelKey(control.controlName), ...control } as IDynamicFormControl));
  }

  get isValid(): boolean {
    return this.form.canSubmit;
  }

  get formData(): any {
    return this.person || { typeCode: 1 };
  }

  getSelectedPerson(): Observable<ISelectedPerson> {
    const action = this.person
      ? this.personSelectService.update(this.person.id, this.form.serializedUpdates)
      : this.personSelectService.create(this.form.serializedUpdates);
    return action.map(personId => ({ id: personId, ...this.form.serializedValue }));
  }
}
