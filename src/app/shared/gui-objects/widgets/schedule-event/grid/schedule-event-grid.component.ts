import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  OnInit, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IScheduleEvent } from '../schedule-event.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ScheduleEventService } from '../schedule-event.service';
import { GridService } from '../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-schedule-event-grid',
  templateUrl: './schedule-event-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEventGridComponent extends DialogFunctions
  implements OnInit, OnDestroy {
  @Output() edit = new EventEmitter<IScheduleEvent>();

  private selectedEvent$ = new BehaviorSubject<IScheduleEvent>(null);

  dialog: any;

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
    { prop: 'isExecuted', renderer: 'checkboxRenderer' },
    { prop: 'startDate', renderer: 'dateRenderer' },
    { prop: 'endDate', renderer: 'dateRenderer' },
    { prop: 'isInactive', renderer: 'checkboxRenderer' },
    { prop: 'priority' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.scheduleEventService.canAdd$,
      action: () => this.edit.emit(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([
        this.scheduleEventService.canEdit$,
        this.selectedEvent$.map(Boolean),
      ]),
      action: () => this.edit.emit(this.selectedEvent),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([
        this.scheduleEventService.canDelete$,
        this.selectedEvent$.map(Boolean),
      ]),
      action: () => this.onDelete(this.selectedEvent),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.scheduleEventService.canView$,
      action: () => this.fetch(),
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

    this.actionSubscription = this.scheduleEventService
      .getAction(ScheduleEventService.MESSAGE_SCHEDULE_EVENT_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedEvent$.next(this.selectedEvent);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get selectedEvent(): IScheduleEvent {
    return (this.events || []).find(
      event =>
        this.selectedEvent$.value && event.id === this.selectedEvent$.value.id,
    );
  }

  onSelect(event: IScheduleEvent): void {
    this.selectedEvent$.next(event);
  }

  onEdit(event: IScheduleEvent): void {
    this.selectedEvent$.next(event);
    this.edit.emit(event);
  }

  onDelete(event: IScheduleEvent): void {
    this.setDialog('delete');
    this.cdRef.markForCheck();
  }

  onRemoveSubmit(): void {
    this.scheduleEventService
      .delete(this.selectedEvent.id)
      .subscribe(() => {
        this.closeDialog();
        this.fetch();
    });
  }

  private fetch(): void {
    this.scheduleEventService.fetchAll().subscribe(events => {
      this.events = events;
      this.cdRef.markForCheck();
    });
  }
}
