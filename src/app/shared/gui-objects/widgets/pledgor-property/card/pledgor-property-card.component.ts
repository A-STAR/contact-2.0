import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgor } from '../../pledgor/pledgor.interface';
import { IPledgeContract } from '../../pledge/pledge.interface';
import { IPledgorProperty } from '../pledgor-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { PledgeService } from '../../pledge/pledge.service';
import { PledgorService } from '../../pledgor/pledgor.service';
import { PledgorPropertyService } from '../../pledgor-property/pledgor-property.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.pledgorProperty.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledgor-property-card',
  templateUrl: './pledgor-property-card.component.html'
})
export class PledgorPropertyCardComponent extends DialogFunctions implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private pledgorId: number;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  searchParams: object;
  property: IPledgorProperty;

  private pledgorSubscription: Subscription;
  private formSubscription: Subscription;
  private canEdit: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private pledgeService: PledgeService,
    private pledgorService: PledgorService,
    private pledgorPropertyService: PledgorPropertyService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    const contract = this.messageBusService.takeValueAndRemove<IPledgeContract>('contract');

    Observable.combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
      contract && contract.id ? this.pledgeService.canEdit$ : this.pledgeService.canAdd$,
      contract && contract.id && !this.isRoute('pledgor/add')
        ? this.pledgorPropertyService.fetch(contract.personId, contract.propertyId)
          .map(property => this.getFormData(contract, property))
        : Observable.of(this.getFormData()),
      contract && contract.id && !this.isRoute('pledgor/add')
        ? this.pledgorService.fetch(contract.personId)
        : Observable.of(null)
    )
    .take(1)
    .subscribe(([ currencyOptions, propertyTypeOptions, canEdit, property, pledgor ]) => {
      this.initControls(canEdit, propertyTypeOptions, currencyOptions);
      this.property = property;
      this.pledgorId = pledgor ? pledgor.id : null;
      this.canEdit = canEdit;
      this.cdRef.markForCheck();
    });

    this.pledgorSubscription = this.messageBusService
      .select<string, IPledgor>(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED)
      .subscribe(pledgor => {
        this.onClear();
        this.pledgorId = pledgor ? pledgor.id : null;
        this.cdRef.markForCheck();
      });
  }

  onFormInit(): void {
    if (this.isRoute('edit') || !this.canEdit) {
      this.form.getControl('propertyType').disable();
      this.cdRef.detectChanges();
    }
  }

  ngAfterViewChecked(): void {
    if (this.formSubscription || !this.form) { return ; }

    this.onFormInit();

    this.formSubscription = this.form.form.valueChanges
      .map(updates => this.form.serializedValue)
      .subscribe(property => {
        this.messageBusService.dispatch(PledgorPropertyService.MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED, null, {
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
    return this.route.snapshot.url.join('/') === segment;
  }
}
