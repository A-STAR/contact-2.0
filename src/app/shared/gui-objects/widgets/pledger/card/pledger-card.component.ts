import { AfterViewChecked, Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup, IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledger } from '../pledger.interface';
import { IUserConstant } from '../../../../../core/user/constants/user-constants.interface';

import { PledgerService } from '../../pledger/pledger.service';
import { PledgeService } from '../../pledge/pledge.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey, parseStringValueAttrs } from '../../../../../core/utils';

const label = makeKey('widgets.pledger.card');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledger-card',
  templateUrl: './pledger-card.component.html'
})
export class PledgerCardComponent implements OnInit, AfterViewChecked {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private currentTypeCode: number;

  controls: IDynamicFormGroup[] = null;
  pledger: IPledger;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgerService: PledgerService,
    private pledgeService: PledgeService,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {
  }

  ngOnInit(): void {
    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EDUCATION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.pledgeService.canAdd$,
    )
    .take(1)
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit ]) => {
      const pledger = this.getFormData();
      this.initControls(canEdit, this.getFormData(), attributeList, { genderOpts, familyStatusOpts, educationOpts, typeOpts });
      this.pledger = pledger;
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewChecked(): void {
    if (this.typeCodeSubscription || !this.form) { return ; }

    this.typeCodeSubscription = this.form.onCtrlValueChange('typeCode')
      .map(value => value && Array.isArray(value) ? value[0] : {})
      .map(value => value.value)
      .filter(Boolean)
      .flatMap((typeCode: number) => {
        this.currentTypeCode = typeCode;
        const attrConstant = this.pledgerService.getAttributeConstant(typeCode);
        return Observable.combineLatest(Observable.of(typeCode), this.userContantsService.get(attrConstant));
      })
      .subscribe(([ typeCode, attributeList ]) => {
        const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
          .map(ctrl => ctrl.controlName);

        const baseControlNames = typeCode === 1
          ? this.form.getFlatControls().map(ctrl => ctrl.controlName).filter(name => !/^stringValue\d+$/.test(name))
          : ['typeCode', 'lastName'];

        const formControlNames = baseControlNames.concat(additionalControlNames);

        this.form.getFlatControls()
          .forEach(control => {
            control.display = formControlNames.includes(control.controlName);
          });

        this.cdRef.markForCheck();
      });
  }

  private isPerson(pledger: IPledger): boolean {
    return pledger.typeCode === 1;
  }

  private getPersonContols(typeOptions: any): IDynamicFormControl[] {
    const { typeOpts, genderOpts, familyStatusOpts, educationOpts } = typeOptions;
    return [
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
      { label: label('educationCode'), controlName: 'educationCode', type: 'select', options: educationOpts },
      { label: label('comment'), controlName: 'comment', type: 'textarea' },
    ];
  }

  private getDefaultControls(typeOptions: any): IDynamicFormControl[] {
    const { typeOpts } = typeOptions;
    return [
      {
        label: label('typeCode'), controlName: 'typeCode', type: 'select',
        options: typeOpts, required: true, markAsDirty: true
      },
      { label: label('lastName'), controlName: 'lastName', type: 'text', required: true },
      { label: label('comment'), controlName: 'comment', type: 'textarea' },
    ];
  }

  private initControls(canEdit: boolean, pledger: IPledger, attributeList: IUserConstant, typeOptions: any): void {
    const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
      .map(ctrl => ctrl.controlName);

    const allAdditionalControls = this.makeControlsFromAttributeList('1,2,3,4,5,6,7,8,9,10')
      .map(ctrl => {
        ctrl.display = additionalControlNames.includes(ctrl.controlName);
        return ctrl;
      });

    const controls = [
      {
        title: 'widgets.pledger.title',
        collapsible: true,
        children: (this.isPerson(pledger) ? this.getPersonContols(typeOptions) : this.getDefaultControls(typeOptions))
          .concat(allAdditionalControls as any[])
      },
    ];

    this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private makeControlsFromAttributeList(strAttributeList: string): IDynamicFormControl[] {
    return strAttributeList
      ? parseStringValueAttrs(strAttributeList)
          .map(attr => (<IDynamicFormControl>{ label: label(attr), controlName: attr, type: 'text' }))
      : [];
  }

  private getFormData(): IPledger {
    return {
      typeCode: 1
    };
  }
}
