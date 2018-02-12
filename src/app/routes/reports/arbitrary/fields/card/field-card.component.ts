import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IReportField } from '../fields.interface';

import { FieldsService } from '../fields.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-arbitrary-report-field-card',
  templateUrl: './field-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'modules.reports.arbitrary.fields.card',
  };
  field: Partial<IReportField>;
  reportId: number;
  fieldId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private fieldsService: FieldsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .map(params => ([ Number(params.get('reportId')), Number(params.get('fieldId')) ]))
      .do(([ reportId, fieldId ]) => {
        this.reportId = reportId;
        this.fieldId = fieldId;
      })
      .switchMap(() => combineLatest(
        this.fieldsService.canEdit$,
        this.fieldId ? this.fieldsService.fetch(this.reportId, this.fieldId) : of({}),
      ))
      .pipe(first())
      .subscribe(([ canEdit, field ]) => {
        this.field = field;
        this.controls = this.initControls(canEdit);
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action = this.fieldId
      ? this.fieldsService.update(this.reportId, this.fieldId, this.form.serializedUpdates)
      : this.fieldsService.create(this.reportId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.fieldsService.dispatchAction(FieldsService.MESSAGE_FIELD_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ 'reports' ]);
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      {
        controlName: 'names',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_REPORT_FIELD_NAME,
          entityId: this.fieldId
        },
        required: true,
        disabled: !canEdit
      },
      { controlName: 'systemName', type: 'text', disabled: !canEdit, required: true },
      { controlName: 'sortOrder', type: 'number', disabled: !canEdit },
      { controlName: 'textWidth', type: 'number', disabled: !canEdit },
    ] as IDynamicFormItem[];
  }
}
