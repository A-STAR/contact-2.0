import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledger } from '../../pledger/pledger.interface';
import { IPledgerProperty } from '../pledger-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { PledgeService } from '../../pledge/pledge.service';
import { PledgerService } from '../../pledger/pledger.service';
import { PledgerPropertyService } from '../../pledger-property/pledger-property.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.pledgerProperty.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledger-property-card',
  templateUrl: './pledger-property-card.component.html'
})
export class PledgerPropertyCardComponent extends DialogFunctions implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private pledgerId: number;

  controls: IDynamicFormGroup[] = null;
  dialog: string = null;
  searchParams: object;
  property: IPledgerProperty;

  private pledgerSubscription: Subscription;
  private formSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageBusService: MessageBusService,
    private pledgeService: PledgeService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    Observable.combineLatest(
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
      this.pledgeService.canAdd$,
      Observable.of(this.getFormData())
    )
    .take(1)
    .subscribe(([ currencyOptions, propertyTypeOptions, canEdit, property ]) => {
      this.initControls(canEdit, propertyTypeOptions, currencyOptions);
      this.property = property;
      this.cdRef.markForCheck();
    });

    this.pledgerSubscription = this.messageBusService
      .select<string, IPledger>(PledgerService.MESSAGE_PLEDGER_SELECTION_CHANGED)
      .subscribe(pledger => {
        this.pledgerId = pledger ? pledger.id : null;
        this.cdRef.markForCheck();
      });
  }

  ngAfterViewChecked(): void {
    if (this.formSubscription || !this.form) { return ; }

    this.formSubscription = this.form.form.valueChanges.subscribe(property => {
      this.messageBusService.dispatch(PledgerPropertyService.MESSAGE_PLEDGER_PROPERTY_SELECTION_CHANGED, null, {
        id: this.form.getControl('id').value,
        pledgeValue: this.form.getControl('pledgeValue').value,
        marketValue: this.form.getControl('marketValue').value,
        currencyId: this.form.getControl('currencyId').value
      });
    });
  }

  ngOnDestroy(): void {
    this.pledgerSubscription.unsubscribe();
  }

  get canSearch(): boolean {
    return !!this.pledgerId;
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
    this.searchParams = { personId: this.pledgerId };
    this.setDialog('findPledgerProperty');
    this.cdRef.markForCheck();
  }

  onSelect(pledger: IPledgerProperty): void {
    const { form } = this.form, propertyTypeField = form.get('propertyType');
    form.patchValue(pledger);
    propertyTypeField.disable();
    propertyTypeField.markAsDirty();
    this.cdRef.markForCheck();
  }

  private initControls(canEdit: boolean, propertyTypeOptions: IOption[], currencyOptions: IOption[]): void {
    this.controls = [
      {
        title: 'widgets.pledgerProperty.title',
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

  private getFormData(): IPledgerProperty {
    return {
      propertyType: 1,
      currencyId: 1
    };
  }
}
