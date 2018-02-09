import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IScheduleEvent } from './schedule-event.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { ScheduleEventService } from './schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { combineLatestAnd } from '@app/core/utils';
import { DialogFunctions } from '@app/core/dialog';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-schedule-events',
  templateUrl: './schedule-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEventComponent extends DialogFunctions
  implements OnInit, OnDestroy {
  private selectedEvents$ = new BehaviorSubject<IScheduleEvent[]>(null);

  @ViewChild(GridComponent) grid: GridComponent;

  @Output() select = new EventEmitter<IScheduleEvent[]>();

  dialog: string;

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 70 },
    { prop: 'groupId', width: 100 },
    { prop: 'groupName' },
    {
      prop: 'eventTypeCode',
      dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE,
    },
    {
      prop: 'periodTypeCode',
      dictCode: UserDictionariesService.DICTIONARY_PERIOD_TYPE,
    },
    { prop: 'startTime' },
    { prop: 'executeDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'isExecuting', renderer: 'checkboxRenderer' },
    { prop: 'startDate', renderer: 'dateRenderer' },
    { prop: 'endDate', renderer: 'dateRenderer' },
    { prop: 'isInactive', renderer: 'checkboxRenderer' },
    { prop: 'priority' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.scheduleEventService.canAdd$,
      action: () => this.onAdd(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([
        this.scheduleEventService.canEdit$,
        this.hasSingleSelection$,
      ]),
      action: () => this.onEdit(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([
        this.scheduleEventService.canDelete$,
        this.hasSingleSelection$,
      ]),
      action: () => this.onDelete(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_START,
      enabled: combineLatestAnd([
        this.scheduleEventService.canStart$,
        this.selectedEvents$.map(Boolean),
      ]),
      children: [
        {
          label: 'widgets.scheduleEvents.start.withCheckGroup',
          action: () => this.onStart(1),
          closeOnClick: true
        },
        {
          label: 'widgets.scheduleEvents.start.withoutCheckGroup',
          action: () => this.onStart(0),
          closeOnClick: true
        },
      ],
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.scheduleEventService.canView$,
      action: () => this.fetch(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_INFO,
      label: 'utilities.schedule.log.buttons.history',
      enabled: this.canViewLog$,
      action: () => this.setDialog('scheduleLogView'),
    },
  ];

  events: IScheduleEvent[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private scheduleEventService: ScheduleEventService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService
      .setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.fetch();

    this.selectedEvents$
      .subscribe(events => this.select.emit(events || []));

    this.actionSubscription = this.scheduleEventService
      .getAction(ScheduleEventService.MESSAGE_SCHEDULE_EVENT_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedEvents$.next(this.selectedEvents);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get selectedEvents(): IScheduleEvent[] {
    return (this.events || []).filter(
      event => this.selectedEvents$.value && event.id === this.selectedEvents$.value[0].id,
    );
  }

  get selectedEventId(): number {
    return this.selectedEvents && this.selectedEvents[0].id;
  }

  get canViewLog$(): Observable<boolean> {
    return combineLatestAnd([
      this.scheduleEventService.canViewLog$,
      this.hasSingleSelection$
    ]);
  }

  get hasSingleSelection$(): Observable<boolean> {
    return this.selectedEvents$.map(
      selected => selected && this.grid.selected.length === 1,
    );
  }

  onSelect(events: IScheduleEvent[]): void {
    this.selectedEvents$.next(events);
  }

  onAdd(): void {
    this.setDialog('add');
    this.cdRef.markForCheck();
  }

  onEdit(): void {
    this.setDialog('edit');
    this.cdRef.markForCheck();
  }

  onDelete(): void {
    this.setDialog('delete');
    this.cdRef.markForCheck();
  }

  onRemoveSubmit(): void {
    this.scheduleEventService.delete(this.selectedEvents[0].id).subscribe(() => {
      this.closeDialog();
      this.selectedEvents$.next(null);
      this.grid.clearSelection();
      this.fetch();
    });
  }

  onStart(checkGroup: 0 | 1): void {
    this.scheduleEventService
      .start(this.grid.selected.map(event => event.id), { checkGroup })
      .subscribe(() => {
        this.selectedEvents$.next(null);
        this.grid.clearSelection();
        this.fetch();
      });
  }

  private fetch(): void {
    this.scheduleEventService.fetchAll()
      .subscribe(events => {
        this.events = events;
        this.selectedEvents$.next(null);
        this.cdRef.markForCheck();
      });
  }
}
