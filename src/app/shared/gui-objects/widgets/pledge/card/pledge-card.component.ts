import { Component, ChangeDetectorRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPledgeContract } from '../pledge.interface';
import { IPledgor } from '../../pledgor/pledgor.interface';
import { IPledgorProperty } from '../../pledgor-property/pledgor-property.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { PledgeService } from '../pledge.service';
import { PledgorService } from '../../pledgor/pledgor.service';
import { PledgorPropertyService } from '../../pledgor-property/pledgor-property.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey, isRoute } from '../../../../../core/utils';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { RoutingService } from '@app/core/routing/routing.service';

const label = makeKey('widgets.pledgeContract.card');

@Component({
  selector: 'app-pledge-card',
  templateUrl: './pledge-card.component.html'
})
export class PledgeCardComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) set form(pledgeForm: DynamicFormComponent) {
    this._form = pledgeForm;
    if (pledgeForm) {
      this.onFormInit();
    }
  }

  private _form: DynamicFormComponent;
  private canEdit: boolean;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;
  private personId = this.routeParams.pledgorId || null;
  private propertyId = this.routeParams.propertyId || null;
  private pledgorSelectionSub: Subscription;
  private pledgorPropertySelectionSub: Subscription;

  controls: IDynamicFormGroup[];
  contract: Partial<IPledgeContract>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeService: PledgeService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService
  ) {}

  get form(): DynamicFormComponent {
    return this._form;
  }

  get contract$(): Observable<IPledgeContract> {
    return this.pledgeService.fetch(this.debtId, +this.contractId, +this.personId, +this.propertyId);
  }

  ngOnInit(): void {
    combineLatest(
      this.pledgeService.fetchAll(this.debtId),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_TYPE),
      this.contract$.flatMap(
        contract => contract && contract.id ? this.pledgeService.canEdit$ : this.pledgeService.canAdd$
      ),
      this.contract$.flatMap(contract => of(contract || this.getFormData()))
    )
    .pipe(first())
    .subscribe(([ contracts, typeOptions, canEdit, pledgeContract ]) => {
      this.controls = this.getControls(canEdit, typeOptions);
      this.contract = pledgeContract;
      this.canEdit = canEdit;
    });

    this.pledgorSelectionSub = this.pledgeService
      .getPayload<IPledgor>(PledgorService.MESSAGE_PLEDGOR_SELECTION_CHANGED)
      .subscribe(pledgor => {
        this.personId = pledgor.id;
        const personId = this.form.getControl('personId');
        personId.setValue(pledgor.id);
        personId.markAsDirty();
      });

    this.pledgorPropertySelectionSub = this.pledgeService
      .getPayload<IPledgorProperty>(PledgorPropertyService.MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED)
      .subscribe(pledgorProperty => {
        this.propertyId = pledgorProperty.id;
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

  onFormInit(): void {
    if (this.isAddingPledgor || !this.canEdit) {
      this.form.form.disable();
      this.cdRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.pledgorSelectionSub.unsubscribe();
    this.pledgorPropertySelectionSub.unsubscribe();
  }

  get canSubmit(): boolean {
    if (this.isAddingPledgor && !!this.contract) {
      return true;
    }
    return this.form && this.form.canSubmit;
  }

  get isAddingPledgor(): boolean {
    return isRoute(this.route, 'pledgor/add');
  }

  onBack(): void {
    this.routingService.navigate([ `/workplaces/debtor-card/${this.route.snapshot.paramMap.get('debtId')}` ], this.route);
  }

  onSubmit(): void {
    const action = this.isAddingPledgor
      ? this.pledgeService.addPledgor(
        this.debtId,
        this.contractId,
        this.pledgeService.createContractPledgor(this.form.getControl('personId').value, this.form.serializedUpdates),
      )
      : isRoute(this.route, 'create')
        ? this.pledgeService.create(
          this.debtId,
          this.pledgeService.createPledgeContractInformation(this.form.serializedUpdates)
        )
        : this.pledgeService.update(
          this.debtId,
          this.contractId,
          this.personId,
          this.contract.propertyId,
          this.form.serializedUpdates,
          this.form.serializedUpdates
        );

    action.subscribe(() => {
      this.pledgeService.dispatchAction(PledgeService.MESSAGE_PLEDGE_CONTRACT_SAVED);
      this.onBack();
    });
  }

  private getControls(canEdit: boolean, typeOptions: IOption[]): IDynamicFormGroup[] {
    const controls = [
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

    return controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
  }

  private getFormData(): Partial<IPledgeContract> {
    return {
      typeCode: 1
    };
  }
}
