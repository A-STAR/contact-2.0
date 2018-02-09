import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IReport } from '../reports.interface';

import { ReportsService } from '../reports.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-arbitrary-report-card',
  templateUrl: './report-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'modules.reports.arbitrary.card',
  };
  report: Partial<IReport>;
  reportId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .map(params => Number(params.get('reportId')))
      .do(reportId => this.reportId = reportId)
      .switchMap(reportId => combineLatest(
        reportId ? this.reportsService.canEdit$ : this.reportsService.canAdd$,
        reportId ? this.reportsService.fetch(reportId) : of({}),
      ))
      .pipe(first())
      .subscribe(([ canEdit, report ]) => {
        this.report = report;
        this.controls = this.initControls(canEdit);
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.reportId
      ? this.reportsService.update(this.reportId, this.form.serializedUpdates)
      : this.reportsService.create(this.form.serializedUpdates);

    action.subscribe(() => {
      this.reportsService.dispatchAction(ReportsService.MESSAGE_REPORT_SAVED);
      this.form.markAsPristine();
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ 'reports' ]);
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      {
        controlName: 'name',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_REPORT_NAME,
          entityId: this.reportId
        },
        required: true,
        disabled: !canEdit
      },
      { controlName: 'sql', type: 'textarea', disabled: !canEdit, required: true },
      { controlName: 'comment', type: 'textarea', disabled: !canEdit },
      { controlName: 'exportUndescribed', type: 'checkbox', disabled: !canEdit, markAsDirty: !this.reportId },
    ] as IDynamicFormItem[];
  }
}
