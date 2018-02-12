import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IReportParamValue } from '../params.interface';

import { ParamsService } from '../params.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-arbitrary-input-params-card',
  templateUrl: './params-card.component.html',
  styleUrls: [ './params-card.component.scss' ],
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
      .map(inputParams => inputParams.sort((p1, p2) => p1.sortOrder - p2.sortOrder))
      .flatMap(inputParams => this.paramsService.createInputParamControls(inputParams))
      .pipe(first())
      .subscribe(controls => {
        this.controls = controls;
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
