import {
  AfterViewChecked, Component, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef, EventEmitter, Output, OnDestroy, OnInit,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup, IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuarantor, IGuaranteeContract } from '../../guarantee/guarantee.interface';

import { GuarantorService } from '../../guarantor/guarantor.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey, parseStringValueAttrs } from '../../../../../core/utils';

const label = makeKey('widgets.guarantor.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantor-card',
  templateUrl: './guarantor-card.component.html'
})
export class GuarantorCardComponent extends DialogFunctions implements AfterViewChecked, OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Output() guarantorChanged = new EventEmitter<IGuarantor>();

  private currentTypeCode: number;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  guarantor: IGuarantor;
  searchParams: object;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guarantorService: GuarantorService,
    private messageBusService: MessageBusService,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canSubmit$(): Observable<boolean> {
    return this.canView$
      .map(canView => canView && !!this.form && this.form.canSubmit)
      .distinctUntilChanged();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('GUARANTEE_VIEW');
  }

  ngOnInit(): void {
    const contract = this.messageBusService.takeValueAndRemove<IGuaranteeContract>('contract') || {};

    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EDUCATION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      contract.id
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
      contract.id ? this.guarantorService.fetch(contract.personId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit, guarantor ]) => {
      const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
        .map(ctrl => ctrl.controlName);

      const allAdditionalControls = this.makeControlsFromAttributeList('1,2,3,4,5,6,7,8,9,10')
        .map(ctrl => {
          ctrl.display = additionalControlNames.includes(ctrl.controlName);
          return ctrl;
        });

      const controls = [
        {
          title: 'widgets.guarantor.title',
          collapsible: true,
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
          ].concat(allAdditionalControls as any[])
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.guarantor = guarantor ? guarantor : { typeCode: 1 };
      this.currentTypeCode = guarantor ? guarantor.typeCode : 1;
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewChecked(): void {
    if (this.typeCodeSubscription || !this.form) { return ; }

    // observe the user choosing between 1: person, 2: enterprise, 3: entrepreneur
    this.typeCodeSubscription = this.form.onCtrlValueChange('typeCode')
      .map(value => value && Array.isArray(value) ? value[0] : {})
      .map(value => value.value)
      .filter(Boolean)
      .flatMap((typeCode: number) => {
        this.currentTypeCode = typeCode;
        const attrConstant = this.guarantorService.getAttributeConstant(typeCode);
        return Observable.combineLatest(Observable.of(typeCode), this.userContantsService.get(attrConstant));
      })
      .subscribe(([ typeCode, attributeList ]) => {
        const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
          .map(ctrl => ctrl.controlName);

        const baseControlNames = typeCode === 1
          ? this.form.getFlatControls().map(ctrl => ctrl.controlName).filter(name => !/^stringValue\d+$/.test(name))
          : ['typeCode', 'lastName'];

        const formControlNames = baseControlNames.concat(additionalControlNames);
        // hide irrelevant controls
        this.form.getFlatControls()
          .forEach(control => {
            control.display = formControlNames.includes(control.controlName);
          });

        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.typeCodeSubscription) {
      this.typeCodeSubscription.unsubscribe();
    }
  }

  onClear(): void {
    const { form } = this.form;
    form.reset();
    form.enable();
    form.patchValue({ typeCode: this.currentTypeCode });
    this.guarantorChanged.emit({});
    this.cdRef.markForCheck();
  }

  onSearch(): void {
    this.searchParams = this.form.serializedUpdates;
    this.setDialog('findGuarantor');
    this.cdRef.markForCheck();
  }

  onSelect(guarantor: IGuarantor): void {
    const { form } = this.form;
    form.patchValue(guarantor);
    form.disable();
    this.guarantorChanged.emit(guarantor);
    this.cdRef.markForCheck();
  }

  private makeControlsFromAttributeList(strAttributeList: string): IDynamicFormControl[] {
    return strAttributeList
      ? parseStringValueAttrs(strAttributeList)
          .map(attr => (<IDynamicFormControl>{ label: label(attr), controlName: attr, type: 'text' }))
      : [];
  }
}
