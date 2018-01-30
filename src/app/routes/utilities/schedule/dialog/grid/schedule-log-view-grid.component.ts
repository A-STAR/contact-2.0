import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IScheduleEventLog } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.interface';

import { ScheduleEventService } from '@app/shared/gui-objects/widgets/schedule-event/schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-schedule-log-view-grid',
  templateUrl: './schedule-log-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLogViewGridComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() eventId: number;

  columns: Array<IGridColumn> = [
    { prop: 'startDateTime' },
    { prop: 'endDateTime' },
    { prop: 'startType', dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_START_TYPE_CODE },
    { prop: 'userFullName' },
  ];

  gridStyles = { height: '500px' };
  eventLogs: Array<IScheduleEventLog> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  private fetch(): void {
    this.scheduleEventService.fetchLogs(this.eventId).subscribe(eventLogs => {
      this.eventLogs = eventLogs;
      this.cdRef.markForCheck();
    });
  }
}
