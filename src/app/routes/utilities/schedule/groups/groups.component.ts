import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ScheduleEventService } from '@app/routes/utilities/schedule/events/schedule-event.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {

  groupId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService
  ) {}

  get showEvents$(): Observable<boolean> {
    return this.scheduleEventService.canView$;
  }

  onGroupSelect(groupId: number): void {
    this.groupId = groupId;
    this.cdRef.markForCheck();
  }
}