import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import {
  IDynamicFormItem, IDynamicFormConfig, IDynamicFormSelectControl, IDynamicFormControl
} from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ScheduleEventEnum, IScheduleGroup, IScheduleType } from '../../schedule-event.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { ScheduleEventService } from '../../schedule-event.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from '@app/shared/components/grid/grid.component';

import { min } from '@app/core/validators';
import { toOption } from '@app/core/utils';

@Component({
  selector: 'app-schedule-type-card',
  templateUrl: './schedule-type-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleTypeCardComponent implements OnInit, OnDestroy {
  @ViewChild('eventType') eventTypeForm: DynamicFormComponent;
  @ViewChild('smsType') smsTypeForm: DynamicFormComponent;
  @ViewChild('groupGrid') groupGrid: GridComponent;

  @Input() eventId: number;
  @Input() type: IScheduleType;

  eventTypeControls: Partial<IDynamicFormItem>[];
  eventTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  smsTypeControls: Partial<IDynamicFormControl>[];
  smsTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  groupGridColumns: Array<IGridColumn> = [
    { prop: 'id', width: 70 },
    { name: 'entityTypeCode', prop: 'entityTypeId', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE, width: 90 },
    { prop: 'name' },
    { prop: 'comment' },
  ];
  groups: IScheduleGroup[] = [];

  selectedType: Partial<IScheduleType>;

  private selectedEventTypeCode$ = new BehaviorSubject<number>(null);
  private selectedEventTypeCodeSub: Subscription;
  private selectedPersonRoles$ = new BehaviorSubject<number[]>(null);
  private selectedPersonRolesSub: Subscription;

  private defaultSender: number;
  private useSender: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private userConstantsService: UserConstantsService,
    private userDictionaryService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
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

    combineLatest(
      this.scheduleEventService.canView$,
      this.userDictionaryService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.userDictionaryService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE),
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userTemplatesService.getTemplates(
        2,
        this.type.personRoles && this.type.personRoles.length === 1 ? this.type.personRoles[0] : 0
      ).map(templates => templates.map(toOption('id', 'name'))),
    )
    .pipe(first())
    .subscribe(([canEdit, phoneOptions, personRoleOptions, defaultSender, useSender, templateOptions]) => {
      this.useSender = useSender.valueB;
      this.defaultSender = defaultSender.valueN;
      this.initEventTypeControls(canEdit, phoneOptions, personRoleOptions, templateOptions);
      this.selectedEventTypeCode$.next(this.type.eventTypeCode);
      this.cdRef.markForCheck();
    });

    this.selectedEventTypeCodeSub = this.selectedEventTypeCode$.subscribe(() => {
      this.selectedType = this.getFormData();
    });

    this.selectedPersonRolesSub = this.selectedPersonRoles$
      .filter(Boolean)
      .flatMap(roles => this.userTemplatesService.getTemplates(2, roles.length > 1 ? 0 : roles[0]))
      .map(templates => templates.map(toOption('id', 'name')))
      .subscribe(templateOptions => {
        const control = this.smsTypeControls.find(c => c.controlName === 'templateId') as IDynamicFormSelectControl;
        control.options = templateOptions;
        this.smsTypeForm.getControl('templateId').setValue('');
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.selectedEventTypeCodeSub.unsubscribe();
    this.selectedPersonRolesSub.unsubscribe();
  }

  get selectedEventTypeCode(): ScheduleEventEnum {
    return this.selectedEventTypeCode$.value;
  }

  get selectedEventTypeForm(): DynamicFormComponent {
    switch (this.selectedEventTypeCode) {
      case ScheduleEventEnum.SMS:
        return this.smsTypeForm;
    }
  }

  get eventTypeForms(): DynamicFormComponent[] {
    return [ this.eventTypeForm, this.selectedEventTypeForm ];
  }

  get groupSelection(): IScheduleGroup[] {
    const groupId = this.eventTypeForm && this.eventTypeForm.getControl('groupId').value;
    return this.groups.filter(group => group.id === groupId);
  }

  get canSubmit(): boolean {
    return this.eventId
      ? !!this.eventTypeForms.find(form => form && form.canSubmit)
      : this.eventTypeForms.every(form => form && form.canSubmit);
  }

  get serializedUpdates(): IScheduleType {
    switch (this.selectedEventTypeCode) {
      case ScheduleEventEnum.GROUP:
        return { ...this.eventTypeForm.serializedUpdates };
      case ScheduleEventEnum.SMS:
        return {
          ...this.eventTypeForm.serializedUpdates,
          ...this.mapAdditionalParameters(this.smsTypeForm.serializedUpdates)
        };
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

  onPersonRoleSelect(): void {
    const personRoleControl = this.smsTypeForm.getControl('personRoles');
    this.selectedPersonRoles$.next(personRoleControl.value);
  }

  private initEventTypeControls(
    canEdit: boolean,
    phoneOptions: IOption[],
    personRoleOptions: IOption[],
    templateOptions: IOption[]
  ): void {
    this.eventTypeControls = [
      {
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

    this.smsTypeControls = [
      {
        controlName: 'phoneTypes',
        type: 'multiselect',
        options: phoneOptions,
        required: true,
        markAsDirty: !this.eventId,
        width: 4
      },
      {
        controlName: 'personRoles',
        type: 'multiselect',
        options: personRoleOptions,
        required: true,
        markAsDirty: !this.eventId,
        onChange: () => this.onPersonRoleSelect(),
        width: 4
      },
      {
        controlName: 'templateId',
        type: 'select',
        options: templateOptions,
        required: true,
        markAsDirty: !this.eventId,
        width: 4
      },
      {
        controlName: 'delay',
        type: 'number',
        disabled: !canEdit,
        required: true,
        validators: [ min(1) ],
        width: this.useSender ? 4 : 12
      },
    ] as IDynamicFormControl[];

    if (this.useSender) {
      this.smsTypeControls.splice(4, 0, {
        controlName: 'senderCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_SMS_SENDER,
        required: true,
        markAsDirty: !this.eventId,
        width: 4
      });
    }
  }

  private fetchGroups(): void {
    this.scheduleEventService.fetchGroups().subscribe(groups => {
      this.groups = groups;
      this.cdRef.markForCheck();
    });
  }

  private getFormData(): Partial<IScheduleType> {
    switch (this.selectedEventTypeCode) {
      case ScheduleEventEnum.GROUP:
        return { ...this.type, eventTypeCode: 1 };
      case ScheduleEventEnum.SMS:
        return {
          phoneTypes: [ 1 ],
          personRoles: [ 1 ],
          senderCode: this.useSender ? this.defaultSender : null,
          ...this.type,
          eventTypeCode: 2
        };
    }
  }

  private mapAdditionalParameters(serializedUpdates: any): Partial<IScheduleType> {
    return {
      checkGroup: serializedUpdates.checkGroup,
      additionalParameters: Object.keys(serializedUpdates)
        .filter(key => key !== 'checkGroup')
        .map(key => ({ name: key, value: serializedUpdates[key].toString() }))
    };
  }
}
