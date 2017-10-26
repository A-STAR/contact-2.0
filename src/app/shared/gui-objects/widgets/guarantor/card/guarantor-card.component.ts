import {
  AfterViewInit, Component, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef, EventEmitter, Output, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup, IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuarantor } from '../../guarantee/guarantee.interface';

import { GuarantorService } from '../../guarantor/guarantor.service';
import { GuaranteeService } from '../../guarantee/guarantee.service';
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
export class GuarantorCardComponent extends DialogFunctions implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Output() guarantorChanged = new EventEmitter<IGuarantor>();

  // private personId = this.routeParams.personId || null;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  guarantor: IGuarantor;
  searchParams: object;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guarantorService: GuarantorService,
    private guaranteeService: GuaranteeService,
    private route: ActivatedRoute,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get routeParams(): any {
    return (<any>this.route.params).value;
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
    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
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
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.typeCodeSubscription = this.form.onCtrlValueChange('typeCode')
      .map(value => value && Array.isArray(value) ? value[0] : {})
      .map(value => value.value)
      .filter(Boolean)
      .flatMap((typeCode: number) => {
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
    this.typeCodeSubscription.unsubscribe();
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
    this.searchParams = this.form.serializedUpdates;
    this.setDialog('findGuarantor');
    this.cdRef.markForCheck();
  }

  onSelect(guarantor: IGuarantor): void {
    this.form.form.patchValue(guarantor);
    this.form.form.disable();
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
