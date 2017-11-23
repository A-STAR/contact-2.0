import {
  Component, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup, IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgor } from '../pledgor.interface';
import { IPledgeContract } from '../../pledge/pledge.interface';
import { IUserConstant } from '../../../../../core/user/constants/user-constants.interface';

import { PledgorService } from '../../pledgor/pledgor.service';
import { PledgeService } from '../../pledge/pledge.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey, parseStringValueAttrs } from '../../../../../core/utils';

const label = makeKey('widgets.pledgor.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledgor-card',
  templateUrl: './pledgor-card.component.html'
})
export class PledgorCardComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) set form(pledgorForm: DynamicFormComponent) {
    this._form = pledgorForm;
    if (pledgorForm) {
      this.onFormInit();
    }
  }

  private _form: DynamicFormComponent;
  private currentTypeCode: number;
  private canEdit: boolean;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;
  private personId = this.routeParams.pledgorId || null;
  private propertyId = this.routeParams.propertyId || null;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  pledgor: IPledgor;
  searchParams: object;
  typeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgorService: PledgorService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private userContantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  get form(): DynamicFormComponent {
    return this._form;
  }

  get contract$(): Observable<IPledgeContract> {
    return this.pledgeService.fetch(this.debtId, +this.contractId, +this.personId, +this.propertyId);
  }

  ngOnInit(): void {
    Observable.combineLatest(
      this.userContantsService.get('Person.Individual.AdditionalAttribute.List'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_FAMILY_STATUS),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EDUCATION),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.contract$.flatMap(
        contract => contract && contract.id ? this.pledgeService.canEdit$ : this.pledgeService.canAdd$
      ),
      this.contract$.flatMap(contract => contract && contract.id && !this.isRoute('pledgor/add')
        ? this.pledgorService.fetch(contract.personId)
        : Observable.of(null)
      )
    )
    .take(1)
    .subscribe(([ attributeList, genderOpts, familyStatusOpts, educationOpts, typeOpts, canEdit, person ]) => {
      const pledgor = person && !this.isRoute('pledgor/add') ? person : this.getFormData();
      this.initControls(canEdit, this.getFormData(), attributeList, { genderOpts, familyStatusOpts, educationOpts, typeOpts });
      this.pledgor = pledgor;
      this.currentTypeCode = pledgor.typeCode;
      this.canEdit = canEdit;
      this.cdRef.markForCheck();
    });
  }

  onFormInit(): void {
    if ((!this.isRoute('pledgor/add') && !this.isRoute('create')) || !this.canEdit) {
      this.form.form.disable();
      this.cdRef.detectChanges();
    }

    this.typeCodeSubscription = this.form.onCtrlValueChange('typeCode')
      .map(value => value && Array.isArray(value) ? value[0] : {})
      .map(value => value.value)
      .filter(Boolean)
      .flatMap((typeCode: number) => {
        this.currentTypeCode = typeCode;
        const attrConstant = this.pledgorService.getAttributeConstant(typeCode);
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

  ngOnDestroy(): void {
    if (this.typeCodeSubscription) {
      this.typeCodeSubscription.unsubscribe();
    }
  }

  get canSearch$(): Observable<boolean> {
    return this.pledgeService.canView$
      .map(canView => canView && !!this.form && this.form.canSubmit)
      .distinctUntilChanged();
  }

  onClear(): void {
    const { form } = this.form;
    form.reset();
    form.enable();
    form.patchValue({ typeCode: this.currentTypeCode });
    form.get('typeCode').markAsDirty();
    this.pledgeService.notify(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED, {});
    this.cdRef.markForCheck();
  }

  onSearch(): void {
    this.searchParams = this.form.serializedUpdates;
    this.setDialog('findPledgor');
    this.cdRef.markForCheck();
  }

  onSelect(pledgor: IPledgor): void {
    const { form } = this.form;
    form.patchValue(pledgor);
    form.get('typeCode').markAsDirty();
    form.disable();
    this.pledgeService.notify(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED, pledgor);
    this.cdRef.markForCheck();
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

  private initControls(canEdit: boolean, pledgor: IPledgor, attributeList: IUserConstant, typeOptions: any): void {
    const additionalControlNames = this.makeControlsFromAttributeList(<string>attributeList.valueS)
      .map(ctrl => ctrl.controlName);

    const allAdditionalControls = this.makeControlsFromAttributeList('1,2,3,4,5,6,7,8,9,10')
      .map(ctrl => {
        ctrl.display = additionalControlNames.includes(ctrl.controlName);
        return ctrl;
      });

    const controls = [
      {
        title: 'widgets.pledgor.title',
        collapsible: true,
        children: (
          this.pledgorService.isPerson(pledgor.typeCode)
            ? this.getPersonContols(typeOptions)
            : this.getDefaultControls(typeOptions)
          ).concat(allAdditionalControls as any[])
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

  private getFormData(): IPledgor {
    return {
      typeCode: 1
    };
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
