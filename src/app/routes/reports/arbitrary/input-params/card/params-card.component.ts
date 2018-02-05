import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IReportParamValue } from '../params.interface';

import { ParamsService } from '../params.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-arbitrary-input-params-card',
  templateUrl: './params-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputParamsCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() reportId: number;

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private paramsService: ParamsService,
  ) {}

  ngOnInit(): void {
    this.paramsService.fetchAll(this.reportId)
      .subscribe(inputParams => {
        this.controls = inputParams
          .map(param => this.paramsService.createInputParamControl(param));
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get inputParamsValues(): IReportParamValue[] {
    return this.paramsService.parseInputParamControls(this.form.serializedValue);
  }
}
