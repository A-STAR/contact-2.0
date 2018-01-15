import { ChangeDetectionStrategy, Component, ViewChild, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IUserConstant } from 'app/core/user/constants/user-constants.interface';
import { IPerson } from '../person-select.interface';

import { UserConstantsService } from 'app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from 'app/core/user/permissions/user-permissions.service';
import { PersonSelectService } from '../person-select.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, parseStringValueAttrs } from '../../../../../core/utils';

const labelKey = makeKey('common.entities.person.fields');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-card',
  templateUrl: './person-select-card.component.html'
})
export class PersonSelectCardComponent implements OnInit {

  @Input() person: IPerson;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private personSelectService: PersonSelectService,
    private userContantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.person
        ? this.userPermissionsService.has('CONTACT_PERSON_EDIT')
        : this.userPermissionsService.has('CONTACT_PERSON_ADD'),
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List')
    )
    .pipe(first())
    .subscribe(([ canEdit, attributeList ]) => {
      this.controls = [
        { controlName: 'lastName', type: 'text', width: 4, required: true, disabled: !canEdit },
        { controlName: 'firstName', type: 'text', width: 4, disabled: !canEdit },
        { controlName: 'middleName', type: 'text', width: 4, disabled: !canEdit },
        { controlName: 'birthDate',  type: 'datepicker', width: 4, disabled: !canEdit },
        {
          controlName: 'genderCode',
          type: 'selectwrapper',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_GENDER,
          disabled: !canEdit
        },
        { controlName: 'birthPlace', type: 'text', width: 4 },
        {
          controlName: 'familyStatusCode',
          type: 'selectwrapper',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
          disabled: !canEdit
        },
        {
          controlName: 'educationCode',
          type: 'selectwrapper',
          width: 4,
          dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
          disabled: !canEdit
        },
        {
          controlName: 'typeCode',
          dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
          markAsDirty: !this.person,
          required: true,
          type: 'selectwrapper',
          disabled: !canEdit
        },
        { controlName: 'comment', type: 'textarea', disabled: !canEdit },
      ].map(control => ({ label: labelKey(control.controlName), ...control } as IDynamicFormControl))
        .concat(this.createAdditionalControls(attributeList));

      this.cdRef.markForCheck();
    });
  }

  get isValid(): boolean {
    return this.form && this.form.canSubmit;
  }

  get formData(): any {
    return this.person || { typeCode: 1 };
  }

  submitPerson(): Observable<IPerson> {
    const action = this.person
      ? this.personSelectService.update(this.person.id, this.form.serializedUpdates)
      : this.personSelectService.create(this.form.serializedUpdates);

    return action.map(personId => ({
      id: this.person ? this.person.id : personId,
      ...this.form.serializedValue
    }));
  }

  private makeControlsFromAttributeList(strAttributeList: string): IDynamicFormControl[] {
    return strAttributeList
      ? parseStringValueAttrs(strAttributeList)
          .map(attr => (<IDynamicFormControl>{ label: labelKey(attr), controlName: attr, type: 'text' }))
      : [];
  }

  private createAdditionalControls(attributeList: IUserConstant): IDynamicFormControl[] {
    const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
      .map(ctrl => ctrl.controlName);

    const allAdditionalControls = this.makeControlsFromAttributeList('1,2,3,4,5,6,7,8,9,10')
      .map(ctrl => {
        ctrl.display = additionalControlNames.includes(ctrl.controlName);
        return ctrl;
      });

    return allAdditionalControls;
  }
}
