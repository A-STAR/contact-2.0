import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgeContract } from '../pledge.interface';
import { IPledgor } from '../../pledgor/pledgor.interface';
import { IPledgorProperty } from '../../pledgor-property/pledgor-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { PledgeService } from '../pledge.service';
import { PledgorService } from '../../pledgor/pledgor.service';
import { PledgorPropertyService } from '../../pledgor-property/pledgor-property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.pledgeContract.card');

@Component({
  selector: 'app-pledge-card',
  templateUrl: './pledge-card.component.html'
})
export class PledgeCardComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private pledgorSelectionSub: Subscription;
  private pledgorPropertySelectionSub: Subscription;

  controls: IDynamicFormGroup[];
  contract: Partial<IPledgeContract>;

  constructor(
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private pledgeService: PledgeService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.pledgeService.canAdd$,
      Observable.of(this.getFormData())
    )
    .take(1)
    .subscribe(([ typeOptions, canEdit, contract ]) => {
      this.initControls(canEdit, typeOptions);
      this.contract = contract;
    });

    this.pledgorSelectionSub = this.messageBusService
      .select<string, IPledgor>(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED)
      .subscribe(pledgor => {
        const personId = this.form.getControl('personId');
        personId.setValue(pledgor.id);
        personId.markAsDirty();
      });

    this.pledgorPropertySelectionSub = this.messageBusService
      .select<string, IPledgorProperty>(PledgorPropertyService.MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED)
      .subscribe(pledgorProperty => {
        const propertyId = this.form.getControl('propertyId');
        propertyId.setValue(pledgorProperty.id);
        propertyId.markAsDirty();
        const pledgeValue = this.form.getControl('pledgeValue');
        pledgeValue.setValue(pledgorProperty.pledgeValue);
        pledgeValue.markAsDirty();
        const marketValue = this.form.getControl('marketValue');
        marketValue.setValue(pledgorProperty.marketValue);
        marketValue.markAsDirty();
        const currencyId = this.form.getControl('currencyId');
        currencyId.setValue(pledgorProperty.currencyId);
        currencyId.markAsDirty();
      });
  }

  ngOnDestroy(): void {
    this.pledgorSelectionSub.unsubscribe();
    this.pledgorPropertySelectionSub.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    this.pledgeService.create(
      this.debtId,
      this.pledgeService.createPledgeContractCreation(this.form.serializedUpdates)
    ).subscribe(() => {
      this.messageBusService.dispatch(PledgeService.MESSAGE_PLEDGE_CONTRACT_SAVED);
      this.onBack();
    });
  }

  private initControls(canEdit: boolean, typeOptions: IOption[]): void {
    this.controls = [
      {
        title: 'widgets.pledgeContract.title', collapsible: true,
        children: [
          { label: label('personId'), controlName: 'personId', type: 'dynamic', required: true, display: false },
          { label: label('propertyId'), controlName: 'propertyId', type: 'number', required: true, display: false },
          { label: label('pledgeValue'), controlName: 'pledgeValue', type: 'number', display: false },
          { label: label('marketValue'), controlName: 'marketValue', type: 'number', display: false },
          { label: label('currencyId'), controlName: 'currencyId', type: 'number', display: false },
          { label: label('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
          { label: label('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
          { label: label('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
          {
            label: label('typeCode'), controlName: 'typeCode',
            type: 'select', options: typeOptions, required: true
          },
          { label: label('comment'), controlName: 'comment', type: 'textarea', }
        ]
      }
    ];

    this.controls = this.controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private getFormData(): Partial<IPledgeContract> {
    return {
      typeCode: 1
    };
  }
}
