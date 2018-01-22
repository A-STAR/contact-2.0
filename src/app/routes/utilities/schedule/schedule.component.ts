import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { IScheduleEvent } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.interface';

import { ScheduleEventService } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent extends DialogFunctions {

  dialog;
  titleParams: any = {
    schedule: null
  };

  eventId: number;

  constructor(
    private scheduleEventService: ScheduleEventService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  onEdit(event: IScheduleEvent): void {
    this.setDialog('schedule');
    this.eventId = event && event.id;
  }

  onDelete(event: IScheduleEvent): void {
    this.titleParams = { schedule: event.groupName };
    this.eventId = event && event.id;
    this.setDialog('delete');
    this.cdRef.markForCheck();
  }

  onRemoveSubmit(): void {
    this.scheduleEventService
      .delete(this.eventId)
      .subscribe(() => this.closeDialog());
  }
}
