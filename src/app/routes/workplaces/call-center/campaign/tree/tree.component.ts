import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { CampaignService } from '../campaign.service';
import { WorkplacesService } from '../../../workplaces.service';

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
    { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
    { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
    { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
    { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19, parentCode: 3 },
    { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

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
