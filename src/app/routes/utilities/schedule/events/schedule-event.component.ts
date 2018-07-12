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
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IScheduleEvent } from './schedule-event.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar/toolbar.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { ScheduleEventService } from './schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import {
  DateRendererComponent,
  DateTimeRendererComponent,
  TickRendererComponent,
} from '@app/shared/components/grids/renderers';
import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd, addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-schedule-events',
  templateUrl: './schedule-event.component.html',
})
export class ScheduleEventComponent extends DialogFunctions implements OnInit, OnDestroy {
  private selectedEvents$ = new BehaviorSubject<IScheduleEvent[]>(null);

  @Output() select = new EventEmitter<IScheduleEvent[]>();

  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IScheduleEvent>;

  dialog: string;

  columns: ISimpleGridColumn<IScheduleEvent>[] = [
    { prop: 'id', width: 70 },
    { prop: 'groupId', width: 100 },
    { prop: 'groupName' },
    { prop: 'eventTypeCode', dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE },
    { prop: 'periodTypeCode', dictCode: UserDictionariesService.DICTIONARY_PERIOD_TYPE },
    { prop: 'startTime' },
    { prop: 'executeDateTime', renderer: DateTimeRendererComponent },
    { prop: 'isExecuting', renderer: TickRendererComponent },
    { prop: 'startDate', renderer: DateRendererComponent },
    { prop: 'endDate', renderer: DateRendererComponent },
    { prop: 'isInactive', renderer: TickRendererComponent },
    { prop: 'priority' },
  ].map(addGridLabel('widgets.scheduleEvents.grid'));

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.scheduleEventService.canAdd$,
      action: () => this.onAdd(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      enabled: combineLatestAnd([
        this.scheduleEventService.canEdit$,
        this.hasSingleSelection$,
      ]),
      action: () => this.onEdit(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      enabled: combineLatestAnd([
        this.scheduleEventService.canDelete$,
        this.hasSingleSelection$,
      ]),
      action: () => this.onDelete(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.START,
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
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      enabled: this.scheduleEventService.canView$,
      action: () => this.fetch(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.INFO,
      label: 'utilities.schedule.log.buttons.history',
      enabled: this.canViewLog$,
      action: () => this.setDialog('scheduleLogView'),
    },
  ];

  events: IScheduleEvent[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
  ) {
    super();
  }

  ngOnInit(): void {
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
      selected => selected && this.grid.selection.length === 1,
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
      this.grid.selection = [];
      this.fetch();
    });
  }

  onStart(checkGroup: 0 | 1): void {
    this.scheduleEventService
      .start(this.grid.selection.map(event => event.id), { checkGroup })
      .subscribe(() => {
        this.selectedEvents$.next(null);
        this.grid.selection = [];
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
