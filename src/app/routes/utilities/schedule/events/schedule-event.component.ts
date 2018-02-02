import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IScheduleEvent } from './schedule-event.interface';

import { ScheduleEventService } from './schedule-event.service';

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

  onSelect(events: IScheduleEvent[]): void {
    this.eventId = events.length && events[0].id;
  }
}
