import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IDynamicFormItem, IDynamicFormConfig } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IScheduleEvent } from '../schedule-event.interface';

import { ScheduleEventService } from '../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { SchedulePeriodCardComponent } from './period/schedule-period-card.component';

@Component({
  selector: 'app-schedule-event-card',
  templateUrl: './schedule-event-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleEventCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) commonForm: DynamicFormComponent;
  @ViewChild(SchedulePeriodCardComponent) periodCard: SchedulePeriodCardComponent;

  @Input() eventId: number;

  controls: IDynamicFormItem[];
  config: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };
  event: Partial<IScheduleEvent>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private location: Location,
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

  get eventForms(): (DynamicFormComponent | SchedulePeriodCardComponent)[] {
    return [ this.commonForm, this.periodCard ];
  }

  get canSubmit(): boolean {
    return this.eventForms
      .filter(Boolean)
      .every(form => form.canSubmit);
  }

  get eventSerializedUpdates(): IScheduleEvent {
    return {
      ...this.commonForm.serializedUpdates,
      ...this.periodCard.serializedUpdates
    };
  }

  onSubmit(): void {
    const action = this.eventId
      ? this.scheduleEventService.update(this.eventId, this.eventSerializedUpdates)
      : this.scheduleEventService.create(this.eventSerializedUpdates);

    action.subscribe(() => {
      this.scheduleEventService.dispatchAction(ScheduleEventService.MESSAGE_SCHEDULE_EVENT_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.location.back();
  }

  private initControls(canEdit: boolean): IDynamicFormItem[] {
    return [
      { controlName: 'startDate', type: 'datepicker', required: true, disabled: !canEdit },
      { controlName: 'endDate', type: 'datepicker', disabled: !canEdit },
      { controlName: 'startTime', type: 'datepicker', displayTime: true, disabled: !canEdit, required: true },
      { controlName: 'isInactive', type: 'checkbox', disabled: !canEdit },
      { controlName: 'priority', type: 'number', disabled: !canEdit },
      {
        controlName: 'eventTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE,
        required: true,
        disabled: !canEdit,
        markAsDirty: !this.eventId,
      },
    ] as IDynamicFormItem[];
  }

  private getFormData(): Partial<IScheduleEvent> {
    return {
      periodTypeCode: 1,
      eventTypeCode: 1
    };
  }
}
