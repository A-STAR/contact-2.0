import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuarantor } from '../../guarantee/guarantee.interface';

import { GuarantorService } from '../../guarantor/guarantor.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.guarantor.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantor-card',
  templateUrl: './guarantor-card.component.html'
})
export class GuarantorCardComponent extends DialogFunctions {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Output() guarantorChanged = new EventEmitter<IGuarantor>();

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.personId || null;
  // private contractId = this.routeParams.contractId || null;
  // private debtId = this.routeParams.debtId || null;

  attrListConstants: object = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };
  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  guarantor: IGuarantor;
  searchParams: object;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guarantorService: GuarantorService,
    private route: ActivatedRoute,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EDUCATION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.personId
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
      this.personId && false ? this.guarantorService.fetch(this.personId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit, guarantor ]) => {
      const addControls = attributeList.valueS
      ? (<string>attributeList.valueS).split(/,\s?/g)
        .filter(Boolean)
        .map(attr => `stringValue${attr}`)
        .map(attr => ({ label: label(attr), controlName: attr, type: 'text' }))
      : [];

      const controls = [
        {
          title: 'widgets.guarantor.title', collapsible: true,
          children: [
            {
              label: label('typeCode'), controlName: 'typeCode', type: 'select',
              options: typeOpts, required: true, markAsDirty: true
            },
            { label: label('lastName'), controlName: 'lastName', type: 'text', required: true },
            { label: label('firstName'), controlName: 'firstName', type: 'text' },
            { label: label('middleName'), controlName: 'firstName', type: 'text' },
            { label: label('birthDate'), controlName: 'birthDate', type: 'datepicker' },
            { label: label('birthPlace'), controlName: 'birthPlace',  type: 'text' },
            { label: label('genderCode'), controlName: 'genderCode', type: 'select', options: genderOpts },
            { label: label('familyStatusCode'), controlName: 'familyStatusCode', type: 'select', options: familyStatusOpts },
            { label: label('educationCode'), controlName: 'educationCode', type: 'select', options: familyStatusOpts },
            { label: label('comment'), controlName: 'comment', type: 'textarea' },
          ].concat(addControls)
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.guarantor = guarantor ? guarantor : { typeCode: 1 };
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onClear(): void {
    const { form } = this.form;
    form.reset();
    form.enable();
    form.patchValue({ typeCode: 1 });
    this.guarantorChanged.emit({});
    this.cdRef.markForCheck();
  }

  onSearch(): void {
    const data = this.form.requestValue;
    this.searchParams = data;
    this.setDialog('findGuarantor');
    this.cdRef.markForCheck();
  }

  onSelect(guarantor: IGuarantor): void {
    this.guarantorChanged.emit(guarantor);
    this.form.form.patchValue(guarantor);
    this.form.form.disable();
    this.cdRef.markForCheck();
  }
}
