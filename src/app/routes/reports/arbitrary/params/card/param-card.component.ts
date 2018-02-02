import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { EntityTranslationsConstants } from '@app/core/entity/translations/entity-translations.interface';
import { IReportParam } from '../params.interface';

import { ParamsService } from '../params.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-arbitrary-report-param-card',
  templateUrl: './param-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParamCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'modules.reports.arbitrary.params.card',
  };
  param: Partial<IReportParam>;
  reportId: number;
  paramId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paramsService: ParamsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .map(params => ([ Number(params.get('reportId')), Number(params.get('paramId')) ]))
      .do(([ reportId, paramId ]) => {
        this.reportId = reportId;
        this.paramId = paramId;
      })
      .switchMap(() => combineLatest(
        this.paramId ? this.paramsService.canEdit$ : this.paramsService.canAdd$,
        this.paramId ? this.paramsService.fetch(this.reportId, this.paramId) : of(this.getFormData()),
      ))
      .pipe(first())
      .subscribe(([ canEdit, param ]) => {
        this.param = param;
        this.controls = this.initControls(canEdit);
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit && (this.paramTypeCode !== 7 || !!this.dictCode);
  }

  get paramTypeCode(): number {
    return this.form && this.form.serializedValue.paramTypeCode;
  }

  get dictCode(): number {
    return this.form && this.form.serializedValue.dictNameCode;
  }

  onSubmit(): void {
    const action = this.paramId
      ? this.paramsService.update(this.reportId, this.paramId, this.form.serializedUpdates)
      : this.paramsService.create(this.reportId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.paramsService.dispatchAction(ParamsService.MESSAGE_PARAM_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigate([ 'reports', 'arbitrary' ]);
  }

  onParamChange(): void {
    const { value: options } = this.form.getControl('paramTypeCode');
    const isMandatoryControl = this.form.getControl('isMandatory');
    const multiSelectControl = this.form.getControl('multiSelect');
    const dictControl = this.form.getFlatControls().find(c => c.controlName === 'dictNameCode');
    multiSelectControl.disable();
    multiSelectControl.setValue(false);
    isMandatoryControl.disable();
    isMandatoryControl.setValue(false);
    dictControl.required = false;
    switch (options[0].value) {
      case 3: case 4: case 5: case 8: case 10:
        multiSelectControl.enable();
        break;
      case 7:
        multiSelectControl.enable();
        dictControl.required = true;
        break;
      case 9:
        isMandatoryControl.enable();
        break;
    }
    this.cdRef.markForCheck();
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      {
        controlName: 'name',
        type: 'multilanguage',
        langConfig: {
          entityAttributeId: EntityTranslationsConstants.SPEC_REPORT_PARAM_NAME,
          entityId: this.paramId
        },
        required: true,
        disabled: !canEdit
      },
      { controlName: 'systemName', type: 'text', disabled: !canEdit, required: true },
      { controlName: 'sortOrder', type: 'number', disabled: !canEdit },
      {
        controlName: 'paramTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_REPORT_PARAM_TYPE_CODE,
        onChange: () => this.onParamChange(),
        required: true
      },
      { controlName: 'isMandatory', type: 'checkbox', disabled: true },
      { controlName: 'multiSelect', type: 'checkbox', disabled: true },
      {
        controlName: 'dictNameCode',
        type: 'select',
        lookupKey: 'dictionaries',
        disabled: !canEdit,
        markAsDirty: !this.paramId
      }
    ] as IDynamicFormItem[];
  }

  private getFormData(): Partial<IReportParam> {
    return {
      paramTypeCode: 1
    };
  }
}
