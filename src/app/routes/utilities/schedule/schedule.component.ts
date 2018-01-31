import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

  eventId: number;

  constructor(
    private scheduleEventService: ScheduleEventService,
  ) {
    super();
  }

  get canViewLog$(): Observable<boolean> {
    return this.scheduleEventService.canViewLog$;
  }

  onEdit(event: IScheduleEvent): void {
    this.setDialog('schedule');
    this.eventId = event && event.id;
  }

  onSelect(event: IScheduleEvent): void {
    this.eventId = event && event.id;
  }

  openViewLogDialog(): void {
    this.setDialog('scheduleLogView');
  }
}
