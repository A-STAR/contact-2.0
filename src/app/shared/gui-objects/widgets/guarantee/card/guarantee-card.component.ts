import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import { RoutingService } from '@app/core/routing/routing.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuaranteeContract, IGuarantor } from '../guarantee.interface';

import { GuaranteeService } from '../guarantee.service';
import { GuarantorService } from '../../guarantor/guarantor.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.guaranteeContract.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantee-card',
  templateUrl: './guarantee-card.component.html'
})
export class GuaranteeCardComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) set form(guaranteeForm: DynamicFormComponent) {
    this._form = guaranteeForm;
    if (guaranteeForm) {
      this.onFormInit();
    }
  }

  private _form: DynamicFormComponent;
  private canEdit: boolean;
  private routeParams = (<any>this.route.params).value;
  private debtId = this.routeParams.debtId || null;
  private contractId = this.routeParams.contractId || null;
  private personId = this.routeParams.guarantorId || null;
  private guarantorSelectionSub: Subscription;

  controls: IDynamicFormGroup[] = null;
  contract: IGuaranteeContract;

  constructor(
    private cdRef: ChangeDetectorRef,
    private guaranteeService: GuaranteeService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canSubmit(): boolean {
    if (this.isAddingGuarantor && !!this.personId) {
      return true;
    }
    return this.form && this.form.canSubmit;
  }

  get isAddingGuarantor(): boolean {
    return this.isRoute('guarantor/add');
  }

  get form(): DynamicFormComponent {
    return this._form;
  }

  get contract$(): Observable<IGuaranteeContract> {
    return this.guaranteeService.fetch(this.debtId, +this.contractId, +this.personId);
  }

  ngOnInit(): void {
    combineLatest(
      this.guaranteeService.fetchAll(this.debtId),
      this.contract$,
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE),
      this.contract$.flatMap(
        contract => this.userPermissionsService.has(contract && contract.id ? 'GUARANTEE_EDIT' : 'GUARANTEE_ADD')
      )
    )
    .pipe(first())
    .subscribe(([ contacts, contract, respTypeOpts, canEdit ]) => {
      const controls: IDynamicFormGroup[] = [
        {
          title: 'widgets.guaranteeContract.title', collapsible: true,
          children: [
            { label: label('personId'), controlName: 'personId',  type: 'number', required: true, display: false },
            { label: label('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true, width: 6 },
            { label: label('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', width: 6 },
            { label: label('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', width: 6 },
            {
              label: label('contractTypeCode'), controlName: 'contractTypeCode',
              type: 'select', options: respTypeOpts, required: true, width: 6
            },
            { label: label('comment'), controlName: 'comment', type: 'textarea', },
          ]
        },
      ];

      this.personId = this.personId;
      this.controls = controls;
      this.contract = contract;
      this.canEdit = canEdit;
      this.cdRef.markForCheck();
    });

    this.guarantorSelectionSub = this.guaranteeService
      .getPayload<IGuarantor>(GuarantorService.MESSAGE_GUARANTOR_SELECTION_CHANGED)
      .subscribe(guarantor => {
        const personId = this.form.getControl('personId');
        personId.setValue(guarantor.id);
        personId.markAsDirty();
      });
  }

  onFormInit(): void {
    if (this.isAddingGuarantor || !this.canEdit) {
      this.form.form.disable();
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.guarantorSelectionSub) {
      this.guarantorSelectionSub.unsubscribe();
    }
  }

  onBack(): void {
    this.routingService.navigate([ `/workplaces/debtor-card/${this.route.snapshot.paramMap.get('debtId')}` ], this.route);
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.isAddingGuarantor
      ? this.guaranteeService.addGuarantor(this.debtId, this.contractId, data.personId)
      : this.isRoute('create')
        ? this.guaranteeService.create(this.debtId, data)
        : this.guaranteeService.update(this.debtId, this.contractId, data);

    action.subscribe(() => {
      this.guaranteeService.dispatchAction(GuaranteeService.MESSAGE_GUARANTEE_CONTRACT_SAVED);
      this.onBack();
    });
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
