import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

import { IDynamicFormItem, IDynamicFormConfig } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { ISchedulePeriod, SchedulePeriodEnum } from '../../schedule-event.interface';

import { ScheduleEventService } from '../../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

// import { minStrict } from '@app/core/validators';

@Component({
  selector: 'app-schedule-period-card',
  templateUrl: './schedule-period-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePeriodCardComponent implements OnInit {
  private daysOfWeek = this.translateService.instant('common.entities.daysOfWeek');

  @ViewChild('periodType') periodTypeForm: DynamicFormComponent;
  @ViewChild('dailyPeriod') dailyPeriodForm: DynamicFormComponent;
  @ViewChild('weeklyPeriod') weeklyPeriodForm: DynamicFormComponent;

  @Input() period: ISchedulePeriod;

  periodTypeControls: Partial<IDynamicFormItem>[];
  periodTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  dailyPeriodControls: Partial<IDynamicFormItem>[];
  dailyPeriodConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  weeklyPeriodControls: Partial<IDynamicFormItem>[];
  weeklyPeriodConfig: IDynamicFormConfig = {
    labelKey: 'common.entities.daysOfWeek',
  };

  private selectedPeriodTypeCode$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.scheduleEventService.canView$
      .pipe(first())
      .subscribe(canEdit => {
        this.initPeriodControls(canEdit);
        this.selectedPeriodTypeCode$.next(this.period.periodTypeCode);
        this.cdRef.markForCheck();
      });
  }

  get selectedPeriodTypeCode(): SchedulePeriodEnum {
    return this.selectedPeriodTypeCode$.value;
  }

  get selectedPeriodForm(): DynamicFormComponent {
    switch (this.selectedPeriodTypeCode) {
      case SchedulePeriodEnum.DAILY:
        return this.dailyPeriodForm;
      case SchedulePeriodEnum.WEEKLY:
        return this.weeklyPeriodForm;
    }
  }

  get canSubmit(): boolean {
    return [
      this.periodTypeForm,
      this.selectedPeriodForm
    ].every(form => form && form.canSubmit);
  }

  get serializedUpdates(): ISchedulePeriod {
    switch (this.selectedPeriodTypeCode) {
      case SchedulePeriodEnum.DAILY:
        return { ...this.periodTypeForm.serializedUpdates, ...this.dailyFormSerializedUpdates };
      case SchedulePeriodEnum.WEEKLY:
        return { ...this.weeklyPeriodForm.serializedUpdates, ...this.weeklyFormSerializedUpdates };
    }
  }

  onPeriodSelect(): void {
    const [ periodControl ] = this.periodTypeForm.getControl('periodTypeCode').value;
    this.selectedPeriodTypeCode$.next(periodControl.value);
    this.cdRef.markForCheck();
  }

  private get dailyFormSerializedUpdates(): any {
    return this.dailyPeriodForm.serializedUpdates;
  }

  private get weeklyFormSerializedUpdates(): any {
    const updates = this.weeklyPeriodForm.serializedUpdates;
    return {
      weekDays: Object.keys(this.daysOfWeek)
        .map((day, index) => updates[day] && ++index)
        .filter(Boolean)
    };
  }

  private initPeriodControls(canEdit: boolean): void {
    this.periodTypeControls = [
      {
        label: null,
        controlName: 'periodTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_PERIOD_TYPE,
        required: true,
        markAsDirty: true,
        onChange: () => this.onPeriodSelect()
      },
    ] as IDynamicFormItem[];

    this.dailyPeriodControls = [
      { controlName: 'dayPeriod', type: 'number', disabled: !canEdit, required: true, },
    ] as IDynamicFormItem[];

    this.weeklyPeriodControls = [
      ...Object.keys(this.daysOfWeek)
        .map(day => ({ controlName: day, type: 'checkbox', disabled: !canEdit, width: 3 }))
    ] as IDynamicFormItem[];
  }
}
