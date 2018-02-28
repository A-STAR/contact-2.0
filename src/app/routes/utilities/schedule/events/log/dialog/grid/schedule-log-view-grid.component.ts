import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';

import { IScheduleEventLog } from '../../../schedule-event.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { ScheduleEventService } from '../../../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-schedule-log-view-grid',
  templateUrl: './schedule-log-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLogViewGridComponent implements OnInit {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IScheduleEventLog>;

  @Input() eventId: number;

  columns: ISimpleGridColumn<IScheduleEventLog>[] = [
    { prop: 'startDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'endDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'startType', dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_START_TYPE_CODE },
    { prop: 'userFullName' },
  ].map(addGridLabel('utilities.schedule.log.grid'));

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
