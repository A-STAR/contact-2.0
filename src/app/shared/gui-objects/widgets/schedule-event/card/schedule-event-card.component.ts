import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IScheduleEvent } from '../schedule-event.interface';

import { ScheduleEventService } from '../schedule-event.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { SchedulePeriodCardComponent } from './period/schedule-period-card.component';
import { ScheduleTypeCardComponent } from './type/schedule-type-card.component';

@Component({
  selector: 'app-schedule-event-card',
  templateUrl: './schedule-event-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleEventCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) commonForm: DynamicFormComponent;
  @ViewChild(SchedulePeriodCardComponent) periodCard: SchedulePeriodCardComponent;
  @ViewChild(ScheduleTypeCardComponent) typeCard: ScheduleTypeCardComponent;

  @Input() eventId: number;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };
  event: Partial<IScheduleEvent>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.scheduleEventService.canView$,
      this.eventId ? this.scheduleEventService.fetch(this.eventId) : of(this.getFormData()),
    )
    .pipe(first())
    .subscribe(([ canEdit, event ]) => {
      this.event = event;
      this.controls = this.initControls(canEdit);
      this.cdRef.markForCheck();
    });
  }

  get eventForms(): { canSubmit: boolean } [] {
    return [ this.commonForm, this.periodCard, this.typeCard ];
  }

  get canSubmit(): boolean {
    return this.eventId
      ? !!this.eventForms.filter(Boolean).find(form => form.canSubmit)
      : this.eventForms.filter(Boolean).every(form => form.canSubmit);
  }

  get eventSerializedUpdates(): IScheduleEvent {
    return {
      ...this.commonForm.serializedUpdates,
      ...this.periodCard.serializedUpdates,
      ...this.typeCard.serializedUpdates
    };
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      { controlName: 'startDate', type: 'datepicker', required: true, disabled: !canEdit, width: 4 },
      { controlName: 'endDate', type: 'datepicker', disabled: !canEdit, width: 4 },
      { controlName: 'startTime', type: 'timepicker', disabled: !canEdit, required: true, width: 4 },
      { controlName: 'priority', type: 'number', disabled: !canEdit },
      { controlName: 'isInactive', type: 'checkbox', disabled: !canEdit },
    ] as IDynamicFormItem[];
  }

  private getFormData(): Partial<IScheduleEvent> {
    return {
      periodTypeCode: 1,
      eventTypeCode: 1
    };
  }
}
