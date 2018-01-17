import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { CampaignService } from '@app/routes/workplaces/call-center/campaign/campaign.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { isEmpty, makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.misc');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-call-center-tree',
  styleUrls: [ './tree.component.scss' ],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit {
  isFormOpen = false;
  nodes = [];
  selectedNode = null;
  scenario: string = null;

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

  // TODO(d.maltsev): should it be 1 or 2?
  // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=81002516
  // Dictionary 50
  private contactTypeCode = 1;

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    this.fetchNodes();
  }

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
    this.debtId$.pipe(
      mergeMap(debtId => this.workplacesService.fetchContactTree(debtId, this.contactTypeCode)),
    )
    .subscribe(nodes => {
      this.nodes = nodes;
      this.cdRef.markForCheck();
    });
  }

  private fetchScenario(nodeId: number): void {
    this.debtId$.pipe(
      mergeMap(debtId => this.workplacesService.fetchContactScenario(debtId, this.contactTypeCode, nodeId)),
      catchError(() => observableOf(null)),
    )
    .subscribe(scenario => {
      this.scenario = scenario;
      this.cdRef.markForCheck();
    });
  }

  private get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.pipe(map(debt => debt.debtId));
  }
}
