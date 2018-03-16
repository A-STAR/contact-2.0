import { ChangeDetectionStrategy, Component, ViewChild, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPerson } from '../person-select.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { PersonSelectService } from '../person-select.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, range } from '@app/core/utils';

const labelKey = makeKey('routes.workplaces.debtor-card.contact-persons.person.fields');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-card',
  templateUrl: './person-select-card.component.html'
})
export class PersonSelectCardComponent implements OnInit {

  @Input() personId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  person: IPerson;

  // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=108101644#id-Списокатрибутовсущностей-person
  private attributeIds = range(363, 372).concat(395);

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private personSelectService: PersonSelectService,
    private userContantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.personId
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.personId
        ? this.userPermissionsService.has('PERSON_INFO_EDIT')
        : this.userPermissionsService.has('PERSON_ADD'),
      this.userPermissionsService.has('PERSON_COMMENT_EDIT'),
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.entityAttributesService.getAttributes(this.attributeIds),
      this.personId ? this.personSelectService.fetch(this.personId) : of(this.formData)
    )
    .pipe(first())
    .subscribe(([ canContactEdit, canPersonEdit, canCommentEdit, attributeList, attributes, person ]) => {
      const displayedStringValues = attributeList.valueS.split(',').map(Number);
      this.person = person;
      this.controls = [
        { controlName: 'lastName', type: 'text', width: 4, required: true, disabled: !canContactEdit || !canPersonEdit },
        { controlName: 'firstName', type: 'text', width: 4, disabled: !canContactEdit || !canPersonEdit },
        { controlName: 'middleName', type: 'text', width: 4, disabled: !canContactEdit || !canPersonEdit },
        { controlName: 'birthDate',  type: 'datepicker', width: 4, disabled: !canContactEdit || !canPersonEdit },
        {
          controlName: 'genderCode',
          type: 'select',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_GENDER,
          disabled: !canContactEdit || !canPersonEdit
        },
        { controlName: 'birthPlace', type: 'text', width: 4, disabled: !canContactEdit || !canPersonEdit },
        {
          controlName: 'familyStatusCode',
          type: 'select',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
          disabled: !canContactEdit || !canPersonEdit
        },
        {
          controlName: 'educationCode',
          type: 'select',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
          disabled: !canContactEdit || !canPersonEdit
        },
        {
          controlName: 'typeCode',
          dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
          markAsDirty: !this.personId,
          required: true,
          type: 'select',
          width: 4,
          disabled: !canContactEdit || !canPersonEdit
        },
        { controlName: 'comment', type: 'textarea', disabled: !canContactEdit || !canCommentEdit },
        ...this.attributeIds.map((id, i) => ({
          label: `person.stringValue${i + 1}`,
          controlName: `stringValue${i + 1}`,
          type: 'text',
          width: 3,
          display: displayedStringValues.includes(id) && attributes[id].isUsed,
          required: displayedStringValues.includes(id) && !!attributes[id].isMandatory,
          disabled: !canContactEdit || !canPersonEdit
        }) as IDynamicFormControl),
      ].map(control => ({ label: labelKey(control.controlName), ...control } as IDynamicFormControl));

      this.cdRef.markForCheck();
    });
  }

  get isValid(): boolean {
    return this.form && this.form.isValid;
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get formData(): any {
    return { typeCode: 1 };
  }

  submitPerson(): Observable<IPerson> {
    const action = this.personId
      ? this.personSelectService.update(this.personId, this.form.serializedUpdates)
      : this.personSelectService.create(this.form.serializedUpdates);

    return action.map(personId => ({
      id: this.personId ? this.personId : personId,
      ...this.form.serializedValue
    }));
  }
}
