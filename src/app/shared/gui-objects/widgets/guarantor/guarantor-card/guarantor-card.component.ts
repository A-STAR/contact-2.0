import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuaranteeContract } from '../../guarantee/guarantee.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GuaranteeService } from '../../guarantee/guarantee.service';
// import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const cLabelKey = makeKey('widgets.guaranteeContract.grid');
const gLabelKey = makeKey('widgets.guarantor.grid');

@Component({
  selector: 'app-guarantor-card',
  templateUrl: './guarantor-card.component.html'
})
export class GuarantorCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  // private personId = this.routeParams.personId || null;
  private contractId = this.routeParams.contractId || null;
  private debtId = this.routeParams.debtId || null;

  controls: IDynamicFormGroup[] = null;
  contract: IGuaranteeContract;
  attrListConstants: object = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };

  constructor(
    private contentTabService: ContentTabService,
    private guaranteeService: GuaranteeService,
    // private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EDUCATION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.contractId
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
      this.contractId ? this.guaranteeService.fetch(this.debtId, this.contractId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ attributeList, respTypeOpts, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit, contract ]) => {
      const addControls = attributeList.valueS
      ? (<string>attributeList.valueS).split(/,\s?/g)
        .filter(Boolean)
        .map(attr => `stringValue${attr}`)
        .map(attr => ({ label: gLabelKey(attr), controlName: attr, type: 'text' }))
      : [];

      const controls = [
        {
          title: 'widgets.guaranteeContract.title', collapsible: true,
          children: [
            { label: cLabelKey('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
            { label: cLabelKey('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
            { label: cLabelKey('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
            {
              label: cLabelKey('contractTypeCode'), controlName: 'contractTypeCode',
              type: 'select', options: respTypeOpts, required: true
            },
            { label: cLabelKey('comment'), controlName: 'comment', type: 'textarea', },
          ]
        },
        {
          title: 'widgets.guarantor.title', collapsible: true,
          children: [
            { label: gLabelKey('lastName'), controlName: 'lastName', type: 'text', required: true },
            { label: gLabelKey('firstName'), controlName: 'firstName', type: 'text' },
            { label: gLabelKey('middleName'), controlName: 'firstName', type: 'text' },
            { label: gLabelKey('birthDate'), controlName: 'birthDate', type: 'datepicker' },
            { label: gLabelKey('birthPlace'), controlName: 'birthPlace',  type: 'text' },
            { label: gLabelKey('genderCode'), controlName: 'genderCode', type: 'select', options: genderOpts },
            { label: gLabelKey('familyStatusCode'), controlName: 'familyStatusCode', type: 'select', options: familyStatusOpts },
            { label: gLabelKey('educationCode'), controlName: 'educationCode', type: 'select', options: familyStatusOpts },
            { label: gLabelKey('typeCode'), controlName: 'typeCode', type: 'select', options: typeOpts, required: true },
            { label: gLabelKey('comment'), controlName: 'comment', type: 'textarea' },
          ].concat(addControls)
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.contract = contract;
    });
  }

  ngOnInit(): void {
    // Set default value
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    const data = this.form.requestValue;
    const action = this.debtId
      ? this.guaranteeService.update(this.debtId, this.contractId, data)
      : this.guaranteeService.create(this.debtId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(GuaranteeService.MESSAGE_GUARANTOR_SAVED);
      this.onBack();
    });
  }
}
