import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IGroupEvent } from './group-events.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GroupEventService } from './group-events.service';
import { ScheduleEventService } from '../../events/schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers/date/date.component';
import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers/datetime/datetime.component';
import { DialogFunctions } from '@app/core/dialog';
import { TickRendererComponent } from '@app/shared/components/grids/renderers/tick/tick.component';

import { combineLatestAnd, addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-group-events',
  templateUrl: './group-events.component.html',
})
export class GroupEventsComponent extends DialogFunctions implements OnInit, OnDestroy {
  private groupId$ = new BehaviorSubject<number>(null);

  selectedEvents$ = new BehaviorSubject<IGroupEvent[]>(null);

  @Input() set groupId(groupId: number) {
    this.groupId$.next(groupId);
  }

  dialog: string;

  columns: ISimpleGridColumn<IGroupEvent>[] = [
    { prop: 'id', width: 70 },
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

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([
        this.groupId$.map(Boolean),
        this.scheduleEventService.canView$,
      ]),
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
      enabled: combineLatestAnd([
        this.groupId$.map(Boolean),
        this.scheduleEventService.canView$
      ]),
      action: () => this.fetch(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_INFO,
      label: 'utilities.schedule.log.buttons.history',
      enabled: combineLatestAnd([
        this.groupId$.map(Boolean),
        this.scheduleEventService.canViewLog$,
        this.hasSingleSelection$
      ]),
      action: () => this.setDialog('scheduleLogView'),
    },
  ];

  events: IGroupEvent[] = [];

  private groupSubscription: Subscription;
  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private groupEventService: GroupEventService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.groupSubscription = this.groupId$
      .do(() => this.events = [])
      .filter(Boolean)
      .subscribe(() => this.fetch());

    this.actionSubscription = this.scheduleEventService
      .getAction(ScheduleEventService.MESSAGE_SCHEDULE_EVENT_SAVED)
      .filter(() => !!this.groupId)
      .subscribe(() => {
        this.fetch();
        this.selectedEvents$.next(this.selectedEvents);
      });
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  get groupId(): number {
    return this.groupId$.value;
  }

  get selectedEvents(): IGroupEvent[] {
    return (this.events || []).filter(
      event => this.selectedEvents$.value && event.id === this.selectedEvents$.value[0].id,
    );
  }

  get selectedEventId(): number {
    return this.selectedEvents && this.selectedEvents[0].id;
  }

  get hasSingleSelection$(): Observable<boolean> {
    return this.selectedEvents$.map(selected => selected && selected.length === 1);
  }

  onSelect(events: IGroupEvent[]): void {
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
      this.fetch();
    });
  }

  onStart(checkGroup: 0 | 1): void {
    this.scheduleEventService
      .start(this.selectedEvents$.value.map(event => event.id), { checkGroup })
      .subscribe(() => {
        this.selectedEvents$.next(null);
        this.fetch();
      });
  }

  private fetch(): void {
    this.groupEventService.fetchAll(this.groupId)
      .subscribe(events => {
        this.events = events;
        this.selectedEvents$.next(null);
        this.cdRef.markForCheck();
      });
  }
}
