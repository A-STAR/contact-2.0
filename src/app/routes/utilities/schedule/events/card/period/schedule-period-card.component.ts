import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import {
  IDynamicFormItem,
  IDynamicFormConfig,
  IDynamicFormControl,
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ISchedulePeriod, SchedulePeriodEnum } from '../../schedule-event.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ScheduleEventService } from '../../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { oneOfGroupRequired } from '@app/core/validators';

@Component({
  selector: 'app-schedule-period-card',
  templateUrl: './schedule-period-card.component.html',
  styleUrls: [ './schedule-period-card.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePeriodCardComponent implements OnInit {
  private _periodForm: DynamicFormComponent;

  @ViewChild('periodType') periodTypeForm: DynamicFormComponent;
  @ViewChild('period') set periodForm(form: DynamicFormComponent) {
    this._periodForm = form;
    if (form) {
      this.setPeriodFromValidators();
    }
  }
  @ViewChild('datesGrid') datesGrid: SimpleGridComponent<any>;

  @Input() eventId: number;
  @Input() period: ISchedulePeriod;

  periodTypeControls: Partial<IDynamicFormItem>[];
  periodTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  periodConfig: IDynamicFormConfig[] = [
    { labelKey: 'widgets.scheduleEvents.card' },
    { labelKey: 'default.date.days.full' }
  ];
  periodFromControls: Array<Partial<IDynamicFormItem>[]> = [];
  periodValidators: Array<ValidatorFn[]>;

  periodGridControls: ISimpleGridColumn<any>[] = [
    { label: 'date', prop: 'date', renderer: DateRendererComponent },
  ];

  selectedPeriod: ISchedulePeriod;

  canEdit: boolean;

  private selectedPeriodTypeCode$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnInit(): void {
    (this.eventId ? this.scheduleEventService.canEdit$ : this.scheduleEventService.canView$)
      .pipe(first())
      .subscribe(canEdit => {
        this.canEdit = canEdit;
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
    return this.periodFromControls
      .indexOf(this._periodForm && this._periodForm.controls) + 1;
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
    return {
      ...this.periodTypeForm.serializedUpdates,
      ...this.periodSerializedUpdates[this.selectedPeriodTypeCode - 1]
    };
  }

  get selectedDates(): any[] {
    const datesControl = this._periodForm && this._periodForm.getControl('dates');
    return datesControl && datesControl.value;
  }

  onPeriodSelect(): void {
    const periodControl = this.periodTypeForm.getControl('periodTypeCode');
    this.selectedPeriodTypeCode$.next(periodControl.value);
  }

  onDateAdd(): void {
    const dateControl = this._periodForm.getControl('date');
    const selectedDatesControl = this._periodForm.getControl('dates');
    const date = this.valueConverterService.dateStringToISO(dateControl.value);
    const selectedDates = selectedDatesControl.value;
    if (date && selectedDates.indexOf(date) === -1) {
      selectedDatesControl.setValue([ ...selectedDates, { date: dateControl.value } ]);
    }
    dateControl.setValue('');
    this.cdRef.markForCheck();
  }

  onDateDelete(): void {
    const date = this.datesGrid.selection[0] && this.datesGrid.selection[0].date;
    const datesControl = this._periodForm.getControl('dates');
    if (date) {
      datesControl.setValue(this.selectedDates.filter(d => d.date !== date));
      datesControl.markAsDirty();
    }
  }

  private get periodSerializedUpdates(): any {
    return [
      this._periodForm.serializedUpdates,
      {
        weekDays: Object.keys(this.scheduleEventService.weekDays)
          .map((day, index) => this._periodForm.serializedValue[day] && ++index)
          .filter(Boolean)
      },
      {
        monthDays: Object.keys(this.scheduleEventService.monthDays)
          .map((day, index) => this._periodForm.serializedValue[day] && ++index)
          .filter(Boolean)
      },
      {
        dates: (this.selectedDates || [])
          .map(date => this.valueConverterService.toDateOnly(date.date))
      }
    ];
  }

  private initPeriodControls(canEdit: boolean): void {
    this.periodTypeControls = [
      {
        controlName: 'periodTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_PERIOD_TYPE,
        required: true,
        markAsDirty: !this.eventId,
        disabled: !canEdit,
        onChange: () => this.onPeriodSelect()
      },
    ] as Partial<IDynamicFormItem>[];

    this.periodFromControls = [
      [ { controlName: 'dayPeriod', type: 'number', disabled: !canEdit, min: 1, required: true } ],
      [
        ...Object.keys(this.scheduleEventService.weekDays)
          .map(day => ({
            label: this.scheduleEventService.weekDays[day],
            controlName: day,
            type: 'checkbox',
            disabled: !canEdit, width: 3
          }))
      ],
      [
        ...Object.keys(this.scheduleEventService.monthDays)
          .map((day, i) => ({
            label: i === 31 ? 'default.date.lastMonthDay' : `${i + 1}`,
            controlName: day,
            type: 'checkbox',
            disabled: !canEdit,
            width: i === 31 ? 3 : 1
          }))
      ],
      [
        { controlName: 'date', type: 'datepicker', minDate: new Date(), disabled: !canEdit },
        { controlName: 'dates', type: 'multiselect', required: true, display: false, disabled: !canEdit },
      ]
    ] as Array<Partial<IDynamicFormControl>[]>;

    this.periodValidators = [
      [],
      [ oneOfGroupRequired ],
      [ oneOfGroupRequired ]
    ];
  }

  private createDaysData(days: number[], dayNames: { [dayControl: string]: string }): any {
    return days
      .map(dayIndex => Object.keys(dayNames)[dayIndex - 1])
      .reduce((acc, day) => ({ ...acc, [day]: 1 }), {});
  }

  private getFormData(): ISchedulePeriod {
    return {
      ...this.period,
      ...this.createDaysData(this.period.weekDays || [], this.scheduleEventService.weekDays),
      ...this.createDaysData(this.period.monthDays || [], this.scheduleEventService.monthDays),
      dates: (this.period.dates || []).map(date => ({ date: this.valueConverterService.dateStringToISO(date) }))
    };
  }

  private setPeriodFromValidators(): void {
    this._periodForm.form.setValidators(this.periodValidators[this.selectedPeriodTypeCode - 1]);
    this._periodForm.form.updateValueAndValidity();
  }
}
