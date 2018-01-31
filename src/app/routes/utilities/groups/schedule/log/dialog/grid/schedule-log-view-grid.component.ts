import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IScheduleEventLog } from '../../../schedule-event.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { ScheduleEventService } from '../../../schedule-event.service';
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
    { prop: 'startDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'endDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'startType', dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_START_TYPE_CODE },
    { prop: 'userFullName' },
  ];

  gridStyles = { height: '500px' };
  eventLogs: Array<IScheduleEventLog> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private scheduleEventService: ScheduleEventService,
  ) { }

  ngOnInit(): void {
    this.gridService
      .setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [ ...columns ];
        this.cdRef.markForCheck();
      });

    this.fetch();
  }

  private fetch(): void {
    this.scheduleEventService.fetchLogs(this.eventId).subscribe(eventLogs => {
      this.eventLogs = eventLogs;
      this.cdRef.markForCheck();
    });
  }
}
