import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';

import { IDynamicFormGroup, IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGuarantor, IGuaranteeContract } from '../../guarantee.interface';

import { GuaranteeService } from '../../guarantee.service';
import { GuarantorService } from '../../guarantor/guarantor.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';
import { makeKey, parseStringValueAttrs } from '@app/core/utils';

const label = makeKey('widgets.guarantor.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantor-card',
  templateUrl: './guarantor-card.component.html'
})
export class GuarantorCardComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) set form(guarantorForm: DynamicFormComponent) {
    this._form = guarantorForm;
    if (guarantorForm) {
      this.onFormInit();
    }
  }

  private _form: DynamicFormComponent;
  private canEdit: boolean;
  private currentTypeCode: number;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;
  private personId = this.routeParams.guarantorId || null;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  guarantor: IGuarantor;
  searchParams: object;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guaranteeService: GuaranteeService,
    private guarantorService: GuarantorService,
    private route: ActivatedRoute,
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

  get form(): DynamicFormComponent {
    return this._form;
  }

  get contract$(): Observable<IGuaranteeContract> {
    return this.guaranteeService.fetch(this.debtId, +this.contractId, +this.personId);
  }

  ngOnInit(): void {
    combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.contract$.flatMap(
        contract => this.userPermissionsService.has(contract && contract.id ? 'GUARANTEE_EDIT' : 'GUARANTEE_ADD')
      ),
      this.contract$.flatMap(
        contract => contract && contract.id ? this.guarantorService.fetch(contract.personId) : of(null)
      )
    )
    .pipe(first())
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, typeOpts, canEdit, guarantor ]) => {
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
            { label: label('lastName'), controlName: 'lastName', type: 'text', required: true, width: 6 },
            {
              label: label('typeCode'), controlName: 'typeCode', type: 'select',
              options: typeOpts, required: true, markAsDirty: true, width: 6
            },
            { label: label('firstName'), controlName: 'firstName', type: 'text', width: 6 },
            { label: label('middleName'), controlName: 'middleName', type: 'text', width: 6 },
            { label: label('birthDate'), controlName: 'birthDate', type: 'datepicker', width: 6 },
            { label: label('birthPlace'), controlName: 'birthPlace',  type: 'text', width: 6 },
            { label: label('genderCode'), controlName: 'genderCode', type: 'select', options: genderOpts, width: 6 },
            {
              label: label('familyStatusCode'), controlName: 'familyStatusCode', type: 'select',
              options: familyStatusOpts, width: 6
            },
            { label: label('educationCode'), controlName: 'educationCode', type: 'select', options: familyStatusOpts },
            { label: label('comment'), controlName: 'comment', type: 'textarea' },
          ].concat(allAdditionalControls as any[])
        },
      ];

      this.canEdit = canEdit;
      this.controls = controls as IDynamicFormGroup[];
      this.guarantor = guarantor && !this.isRoute('guarantor/add') ? guarantor : { typeCode: 1 };
      this.currentTypeCode = guarantor && !this.isRoute('guarantor/add') ? guarantor.typeCode : 1;
      this.cdRef.markForCheck();
    });
  }

  onFormInit(): void {
    if ((!this.isRoute('guarantor/add') && !this.isRoute('create')) || !this.canEdit) {
      this.form.form.disable();
      this.cdRef.detectChanges();
    }

     // observe the user choosing between 1: person, 2: enterprise, 3: entrepreneur
     this.typeCodeSubscription = this.form.onCtrlValueChange('typeCode')
      .map(value => value && Array.isArray(value) ? value[0] : {})
      .map(value => value.value)
      .filter(Boolean)
      .flatMap((typeCode: number) => {
        this.currentTypeCode = typeCode;
        const attrConstant = this.guarantorService.getAttributeConstant(typeCode);
        return combineLatest(of(typeCode), this.userContantsService.get(attrConstant));
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
    form.get('typeCode').markAsDirty();
    this.guaranteeService.dispatchAction(GuarantorService.MESSAGE_GUARANTOR_SELECTION_CHANGED, {});
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
    form.get('typeCode').markAsDirty();
    form.disable();
    this.guaranteeService.dispatchAction(GuarantorService.MESSAGE_GUARANTOR_SELECTION_CHANGED, guarantor);
    this.cdRef.markForCheck();
  }

  private makeControlsFromAttributeList(strAttributeList: string): IDynamicFormControl[] {
    return strAttributeList
      ? parseStringValueAttrs(strAttributeList)
          .map(attr => (<IDynamicFormControl>{ label: label(attr), controlName: attr, type: 'text' }))
      : [];
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
