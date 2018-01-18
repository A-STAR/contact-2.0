import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { isEmpty, makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.misc');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration',
  styleUrls: [ './contact-registration.component.scss' ],
  templateUrl: './contact-registration.component.html',
})
export class ContactRegistrationComponent {
  @Input() contactTypeCode: number;

  @Input('debtId')
  set debtId(debtId: number) {
    this._debtId = debtId;
    this.fetchNodes();
  }

  isFormOpen = false;
  nodes = [];
  selectedNode = null;
  scenario: string = null;

  private _debtId: number;

  controls = [
    // Promise
    {
      title: 'modules.contactRegistration.promise.title',
      children: [
        { controlName: 'date', type: 'datepicker', /* minDate, maxDate, */ required: true },
        {
          controlName: 'amount',
          type: 'number',
          // validators: [
          //   minStrict(promiseMode === 2 && !canAddInsufficientAmount ? this.minDebtAmount : 0),
          //   max(this.debt.debtAmount),
          // ],
          required: true,
          // disabled: promiseMode === 3,
          // onChange: event => this.onAmountChange(event, this.debt.debtAmount)
        },
        {
          controlName: 'percentage',
          type: 'number',
          // validators: [
          //   minStrict(promiseMode === 2 && !canAddInsufficientAmount ? this.limit.minAmountPercent : 0),
          //   max(100),
          // ],
          // disabled: promiseMode === 3,
          // onChange: event => this.onPercentageChange(event, this.debt.debtAmount)
        },
      ]
    },
    // Payment
    {
      title: 'modules.contactRegistration.payment.title',
      children: [
        { controlName: 'date', type: 'datepicker', required: true, /* maxDate, */ },
        {
          controlName: 'amount',
          type: 'number',
          required: true,
          // disabled: paymentMode === 3,
          // validators: [ minStrict(0), max(debtAmount) ],
          // onChange: event => this.onAmountChange(event, debtAmount)
        },
        {
          controlName: 'percentage',
          type: 'number',
          // disabled: paymentMode === 3,
          // validators: [ minStrict(0), max(100) ],
          // onChange: event => this.onPercentageChange(event, debtAmount)
        },
        { controlName: 'currencyId', type: 'selectwrapper', lookupKey: 'currencies', required: true },
      ]
    },
    // Phone
    {
      title: 'modules.contactRegistration.phone.title',
      children: [
        {
          controlName: 'typeCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE,
          required: true,
        },
        { controlName: 'phone', type: 'text', required: true },
        { controlName: 'stopAutoSms', type: 'checkbox' },
        { controlName: 'stopAutoInfo', type: 'checkbox' },
        { controlName: 'comment', type: 'textarea' },
        // Contact registration select
      ]
    },
    // Misc
    {
      title: 'modules.contactRegistration.misc.title',
      children: [
        { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
        { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
        { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
        { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19, parentCode: 3 },
        { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
        { controlName: 'comment', type: 'textarea' },
        // AutoCommentId
        // AutoComment
      ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[]
    }
  ];

  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private workplacesService: WorkplacesService,
  ) {}

  get scenarioText(): string {
    // TODO(d.maltsev): i18n
    return this.selectedNode
      ? this.scenario || 'Scenario is empty:('
      : 'Select something below...';
  }

  onNodeSelect(event: any): void {
    const { node } = event;
    if (node && isEmpty(node.children)) {
      this.selectedNode = node.data;
      this.cdRef.markForCheck();
      this.fetchScenario(event.node.data.id);
    }
  }

  onNodeDoubleClick(node: any): void {
    this.isFormOpen = true;
    if (node && isEmpty(node.children)) {
      this.selectedNode = node.data;
      this.cdRef.markForCheck();
    }
  }

  onBack(): void {
    this.isFormOpen = false;
    this.cdRef.markForCheck();
  }

  private fetchNodes(): void {
    this.workplacesService
      .fetchContactTree(this._debtId, this.contactTypeCode)
      .subscribe(nodes => {
        this.nodes = nodes;
        this.cdRef.markForCheck();
      });
  }

  private fetchScenario(nodeId: number): void {
    this.workplacesService
      .fetchContactScenario(this._debtId, this.contactTypeCode, nodeId)
      .pipe(
        catchError(() => of(null)),
      )
      .subscribe(scenario => {
        this.scenario = scenario;
        this.cdRef.markForCheck();
      });
  }
}
