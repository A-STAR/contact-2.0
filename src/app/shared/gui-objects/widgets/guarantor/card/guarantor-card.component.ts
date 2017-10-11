import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuarantor } from '../../guarantee/guarantee.interface';

import { GuarantorService } from '../../guarantor/guarantor.service';
// import { LookupService } from '../../../../../core/lookup/lookup.service';
// import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.guarantor.grid');

@Component({
  selector: 'app-guarantor-card',
  templateUrl: './guarantor-card.component.html'
})
export class GuarantorCardComponent extends DialogFunctions implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  // private personId = this.routeParams.personId || null;
  private contractId = this.routeParams.contractId || null;
  private debtId = this.routeParams.debtId || null;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  guarantor: IGuarantor;
  attrListConstants: object = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };

  constructor(
    private guarantorService: GuarantorService,
    // private lookupService: LookupService,
    // private messageBusService: MessageBusService,
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
      this.contractId
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
      this.contractId ? this.guarantorService.fetch(this.debtId, this.contractId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit, guarantor ]) => {
      const addControls = attributeList.valueS
      ? (<string>attributeList.valueS).split(/,\s?/g)
        .filter(Boolean)
        .map(attr => `stringValue${attr}`)
        .map(attr => ({ label: labelKey(attr), controlName: attr, type: 'text' }))
      : [];

      const controls = [
        {
          title: 'widgets.guaranteeContract.title', collapsible: true,
          children: [
            { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', options: typeOpts, required: true },
            { label: labelKey('lastName'), controlName: 'lastName', type: 'text', required: true },
            { label: labelKey('firstName'), controlName: 'firstName', type: 'text' },
            { label: labelKey('middleName'), controlName: 'firstName', type: 'text' },
            { label: labelKey('birthDate'), controlName: 'birthDate', type: 'datepicker' },
            { label: labelKey('birthPlace'), controlName: 'birthPlace',  type: 'text' },
            { label: labelKey('genderCode'), controlName: 'genderCode', type: 'select', options: genderOpts },
            { label: labelKey('familyStatusCode'), controlName: 'familyStatusCode', type: 'select', options: familyStatusOpts },
            { label: labelKey('educationCode'), controlName: 'educationCode', type: 'select', options: familyStatusOpts },
            { label: labelKey('comment'), controlName: 'comment', type: 'textarea' },
          ].concat(addControls)
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.guarantor = guarantor;
    });
  }

  ngOnInit(): void {
    // Set default value
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onClear(): void {
    this.form.form.reset();
  }

  onClose(event: UIEvent): void {
    this.closeDialog();
  }

  onSearch(): void {
    const data = this.form.requestValue;
    console.log('search for', data);
    this.setDialog('findGuarantor');
    // const action = this.debtId
    //   ? this.guarantorService.update(this.debtId, this.personId, data)
    //   : this.guarantorService.create(this.debtId, data);

    // action.subscribe(() => {
    //   this.messageBusService.dispatch(GuarantorService.MESSAGE_GUARANTOR_SAVED);
    // });
  }
}
