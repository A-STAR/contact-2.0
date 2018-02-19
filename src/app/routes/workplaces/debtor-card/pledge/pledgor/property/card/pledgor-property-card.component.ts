import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPledgor } from '../../pledgor.interface';
import { IPledgeContract } from '../../../pledge.interface';
import { IPledgorProperty } from '../pledgor-property.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { PledgeService } from '../../../../pledge/pledge.service';
import { PledgorService } from '../../../pledgor/pledgor.service';
import { PledgorPropertyService } from '../pledgor-property.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';
import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.pledgorProperty.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledgor-property-card',
  templateUrl: './pledgor-property-card.component.html'
})
export class PledgorPropertyCardComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) set form(propertyForm: DynamicFormComponent) {
    this._form = propertyForm;
    if (propertyForm) {
      this.onFormInit();
    }
  }

  private _form: DynamicFormComponent;
  private pledgorId: number;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  searchParams: object;
  property: IPledgorProperty;

  private pledgorSubscription: Subscription;
  private formSubscription: Subscription;
  private canEdit: boolean;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;
  private personId = this.routeParams.pledgorId || null;
  private propertyId = this.routeParams.propertyId || null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private pledgeService: PledgeService,
    private pledgorService: PledgorService,
    private pledgorPropertyService: PledgorPropertyService,
    private lookupService: LookupService,
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
    combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
      this.contract$.flatMap(
        contract => contract && contract.id ? this.pledgeService.canEdit$ : this.pledgeService.canAdd$
      ),
      this.contract$.flatMap(
        contract => contract && contract.id && !this.isRoute('pledgor/add')
          ? this.pledgorPropertyService.fetch(contract.personId, contract.propertyId)
            .map(property => this.getFormData(contract, property))
          : of(this.getFormData())
      ),
      this.contract$.flatMap(
        contract => contract && contract.id && !this.isRoute('pledgor/add')
          ? this.pledgorService.fetch(contract.personId)
          : of(null)
      )
    )
    .pipe(first())
    .subscribe(([ currencyOptions, propertyTypeOptions, canEdit, property, pledgor ]) => {
      this.initControls(canEdit, propertyTypeOptions, currencyOptions);
      this.property = property;
      this.pledgorId = pledgor ? pledgor.id : null;
      this.canEdit = canEdit;
      this.cdRef.markForCheck();
    });

    this.pledgorSubscription = this.pledgeService
      .getPayload<IPledgor>(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED)
      .subscribe(pledgor => {
        this.onClear();
        this.pledgorId = pledgor ? pledgor.id : null;
        this.cdRef.markForCheck();
      });
  }

  onFormInit(): void {
    if ((!this.isRoute('pledgor/add') && !this.isRoute('create')) || !this.canEdit) {
      this.form.getControl('propertyType').disable();
      this.cdRef.detectChanges();
    }

    this.formSubscription = this.form.form.valueChanges
      .map(updates => this.form.serializedValue)
      .subscribe(property => {
        this.pledgeService.dispatchAction(PledgorPropertyService.MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED, {
          id: property.id,
          pledgeValue: property.pledgeValue,
          marketValue: property.marketValue,
          currencyId: (property.currencyId || {}).value || property.currencyId
        });
      });
  }

  ngOnDestroy(): void {
    this.pledgorSubscription.unsubscribe();
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  get canSearch(): Observable<boolean> {
    return this.pledgeService.canView$.map(canView => canView && !!this.form && this.form.canSubmit).distinctUntilChanged();
  }

  onClear(): void {
    const { form } = this.form;
    form.reset();
    form.enable();
    form.patchValue(this.getFormData());
    form.get('propertyType').markAsDirty();
    this.cdRef.markForCheck();
  }

  onSearch(): void {
    this.searchParams = { personId: this.pledgorId };
    this.setDialog('findPledgorProperty');
    this.cdRef.markForCheck();
  }

  onSelect(pledgor: IPledgorProperty): void {
    const { form } = this.form, propertyTypeField = form.get('propertyType');
    form.patchValue(pledgor);
    propertyTypeField.disable();
    propertyTypeField.markAsDirty();
    this.cdRef.markForCheck();
  }

  private initControls(canEdit: boolean, propertyTypeOptions: IOption[], currencyOptions: IOption[]): void {
    this.controls = [
      {
        title: 'widgets.pledgorProperty.title',
        collapsible: true,
        children: [
          { label: label('id'), controlName: 'id', type: 'number', display: false },
          {
            label: label('propertyType'), controlName: 'propertyType', type: 'select',
            options: propertyTypeOptions, required: true, markAsDirty: true
          },
          { label: label('pledgeValue'), controlName: 'pledgeValue', type: 'number' },
          { label: label('marketValue'), controlName: 'marketValue', type: 'number' },
          {
            label: label('currencyId'), controlName: 'currencyId', type: 'select',
            options: currencyOptions, required: true, markAsDirty: true
          },
        ]
      },
    ];

    this.controls = this.controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private getFormData(contract?: IPledgeContract, property?: IPledgorProperty): IPledgorProperty {
    return contract && property
      ? {
        marketValue: contract.marketValue,
        pledgeValue: contract.pledgeValue,
        currencyId: contract.currencyId,
        ...property
      }
      : {
        propertyType: 1,
        currencyId: 1
      };
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
