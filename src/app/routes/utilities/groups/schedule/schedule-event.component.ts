import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IScheduleEvent } from '@app/routes/utilities/groups/schedule/schedule-event.interface';

import { ScheduleEventService } from '@app/routes/utilities/groups/schedule/schedule-event.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-schedule-events',
  templateUrl: './schedule-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEventComponent extends DialogFunctions {
  dialog: any;

  eventId: number;

  constructor(
    private scheduleEventService: ScheduleEventService,
  ) {
    super();
  }

  get canViewLog$(): Observable<boolean> {
    return this.scheduleEventService.canViewLog$
      .map(canView => canView && !!this.eventId);
  }

  onSelect(event: IScheduleEvent): void {
    this.eventId = event && event.id;
  }
}
