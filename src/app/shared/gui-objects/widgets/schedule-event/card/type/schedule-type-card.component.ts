import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IDynamicFormItem, IDynamicFormConfig } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { ScheduleEventEnum, IScheduleGroup, IScheduleType } from '../../schedule-event.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { ScheduleEventService } from '../../schedule-event.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-schedule-type-card',
  templateUrl: './schedule-type-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleTypeCardComponent implements OnInit {
  @ViewChild('eventType') eventTypeForm: DynamicFormComponent;
  @ViewChild('groupGrid') groupGrid: GridComponent;

  @Input() eventId: number;
  @Input() type: IScheduleType;

  eventTypeControls: Partial<IDynamicFormItem>[];
  eventTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  groupGridColumns: Array<IGridColumn> = [
    { prop: 'id', width: 70 },
    { name: 'entityTypeCode', prop: 'entityTypeId', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE, width: 90 },
    { prop: 'name' },
    { prop: 'comment' },
  ];
  groups: IScheduleGroup[] = [];

  private selectedEventTypeCode$ = new BehaviorSubject<number>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private scheduleEventService: ScheduleEventService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.groupGridColumns)
      .pipe(first())
      .subscribe(columns => {
        this.groupGridColumns = [...columns];
        this.cdRef.markForCheck();
      });

    this.fetchGroups();

    this.scheduleEventService.canView$
      .pipe(first())
      .subscribe(canEdit => {
        this.initEventTypeControls(canEdit);
        this.selectedEventTypeCode$.next(this.type.eventTypeCode);
        this.cdRef.markForCheck();
      });
  }

  get selectedEventTypeCode(): ScheduleEventEnum {
    return this.selectedEventTypeCode$.value;
  }

  get selectedGroupId(): number {
    return this.eventTypeForm.getControl('groupId').value;
  }

  get groupSelection(): IScheduleGroup[] {
    return this.groups.filter(group => group.id === this.selectedGroupId);
  }

  get canSubmit(): boolean {
    return this.eventTypeForm && this.eventTypeForm.canSubmit && !!this.selectedGroupId;
  }

  get serializedUpdates(): IScheduleType {
    switch (this.selectedEventTypeCode) {
      case ScheduleEventEnum.GROUP:
        return { ...this.eventTypeForm.serializedUpdates };
    }
  }

  onEventTypeSelect(): void {
    const [ eventTypeControl ] = this.eventTypeForm.getControl('eventTypeCode').value;
    this.selectedEventTypeCode$.next(eventTypeControl.value);
    this.cdRef.markForCheck();
  }

  onGroupSelect(group: IScheduleGroup): void {
    const groupIdControl = this.eventTypeForm.getControl('groupId');
    groupIdControl.setValue(group.id);
    groupIdControl.markAsDirty();
  }

  private initEventTypeControls(canEdit: boolean): void {
    this.eventTypeControls = [
      {
        label: null,
        controlName: 'eventTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE,
        required: true,
        disabled: !canEdit,
        markAsDirty: !this.eventId,
        onChange: () => this.onEventTypeSelect()
      },
      { controlName: 'groupId', type: 'number', display: false, required: true }
    ] as IDynamicFormItem[];
  }

  private fetchGroups(): void {
    this.scheduleEventService.fetchGroups().subscribe(groups => {
      this.groups = groups;
      this.cdRef.markForCheck();
    });
  }
}
