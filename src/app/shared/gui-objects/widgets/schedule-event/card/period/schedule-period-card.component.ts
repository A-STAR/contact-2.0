import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

import {
  IDynamicFormItem, IDynamicFormConfig, IDynamicFormControl
} from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { ISchedulePeriod, SchedulePeriodEnum } from '../../schedule-event.interface';

import { ScheduleEventService } from '../../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { min, oneOfGroupRequired } from '@app/core/validators';
import { ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-schedule-period-card',
  templateUrl: './schedule-period-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePeriodCardComponent implements OnInit {
  private daysOfWeek = this.translateService.instant('common.entities.daysOfWeek');

  private _periodForm: DynamicFormComponent;

  @ViewChild('periodType') periodTypeForm: DynamicFormComponent;
  @ViewChild('period') set periodForm(form: DynamicFormComponent) {
    this._periodForm = form;
    if (form) {
      this.setPeriodFromValidators();
    }
  }

  @Input() eventId: number;
  @Input() period: ISchedulePeriod;

  periodTypeControls: Partial<IDynamicFormItem>[];
  periodTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  periodConfig: IDynamicFormConfig[] = [
    { labelKey: 'widgets.scheduleEvents.card' },
    { labelKey: 'common.entities.daysOfWeek' }
  ];
  periodControls: Array<Partial<IDynamicFormItem>[]>;
  periodValidators: Array<ValidatorFn[]>;

  selectedPeriod: ISchedulePeriod;

  private selectedPeriodTypeCode$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    (this.eventId ? this.scheduleEventService.canEdit$ : this.scheduleEventService.canView$)
      .pipe(first())
      .subscribe(canEdit => {
        this.initPeriodControls(canEdit);

        this.selectedPeriodTypeCode$.next(this.period.periodTypeCode);
        this.selectedPeriodTypeCode$.subscribe(() => {
          this.selectedPeriod = this.getFormData();
          this.cdRef.markForCheck();
        });

        this.cdRef.markForCheck();
      });
  }

  get selectedPeriodTypeCode(): SchedulePeriodEnum {
    return this.selectedPeriodTypeCode$.value;
  }

  get currentPeriodFormType(): number {
    return this.periodControls.indexOf(this._periodForm.controls) + 1;
  }

  get periodForms(): DynamicFormComponent[] {
    return [ this.periodTypeForm, this._periodForm ];
  }

  get canSubmit(): boolean {
    return this.selectedPeriodTypeCode === this.currentPeriodFormType
      && this.periodForms.find(form => form && form.canSubmit)
      && this.periodForms.every(form => form && form.isValid);
  }

  get serializedUpdates(): ISchedulePeriod {
    switch (this.selectedPeriodTypeCode) {
      case SchedulePeriodEnum.DAILY:
        return { ...this.periodTypeForm.serializedUpdates, ...this.dailyFormSerializedUpdates };
      case SchedulePeriodEnum.WEEKLY:
        return { ...this.periodTypeForm.serializedUpdates, ...this.weeklyFormSerializedUpdates };
    }
  }

  onPeriodSelect(): void {
    const [ periodControl ] = this.periodTypeForm.getControl('periodTypeCode').value;
    this.selectedPeriodTypeCode$.next(periodControl.value);
  }

  private get dailyFormSerializedUpdates(): any {
    return this._periodForm.serializedUpdates;
  }

  private get weeklyFormSerializedUpdates(): any {
    return {
      weekDays: Object.keys(this.daysOfWeek)
        .map((day, index) => this._periodForm.serializedValue[day] && ++index)
        .filter(Boolean)
    };
  }

  private initPeriodControls(canEdit: boolean): void {
    this.periodTypeControls = [
      {
        controlName: 'periodTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_PERIOD_TYPE,
        required: true,
        markAsDirty: !this.eventId,
        onChange: () => this.onPeriodSelect()
      },
    ] as Partial<IDynamicFormItem>[];

    this.periodControls = [
      [ { controlName: 'dayPeriod', type: 'number', disabled: !canEdit, required: true, validators: [ min(1) ] } ],
      [
        ...Object.keys(this.daysOfWeek)
          .map(day => ({ controlName: day, type: 'checkbox', disabled: !canEdit, width: 3 }))
      ]
    ] as Array<Partial<IDynamicFormControl>[]>;

    this.periodValidators = [
      [],
      [ oneOfGroupRequired ]
    ];
  }

  private createWeekDays(): any {
    return (this.period.weekDays || [])
      .map(dayIndex => Object.keys(this.daysOfWeek)[dayIndex - 1])
      .reduce((acc, day) => ({...acc, [day]: 1 }), {});
  }

  private getFormData(): ISchedulePeriod {
    switch (this.selectedPeriodTypeCode) {
      case SchedulePeriodEnum.DAILY:
        return { ...this.period };
      case SchedulePeriodEnum.WEEKLY:
        return this.createWeekDays();
    }
  }

  private setPeriodFromValidators(): void {
    this._periodForm.form.setValidators(this.periodValidators[this.selectedPeriodTypeCode]);
    this._periodForm.form.updateValueAndValidity();
  }
}
