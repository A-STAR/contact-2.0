import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import {
  IDynamicFormItem, IDynamicFormConfig, IDynamicFormSelectControl, IDynamicFormControl
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IScheduleGroup, IScheduleType, IScheduleUser } from '../../schedule-event.interface';

import { ScheduleEventService } from '../../schedule-event.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-schedule-type-card',
  templateUrl: './schedule-type-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleTypeCardComponent implements OnInit, OnDestroy {
  @ViewChild('eventType') eventTypeForm: DynamicFormComponent;
  @ViewChild('addParams') addParamsForm:  DynamicFormComponent;
  @ViewChild('groupGrid') groupGrid: GridComponent;

  @Input() groupId: number;
  @Input() eventId: number;
  @Input() type: IScheduleType;

  eventTypeControls: Partial<IDynamicFormItem>[];
  eventTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  addParamsControls: Array<Partial<IDynamicFormItem>[]> = [];
  addParamsData: any;

  selectedType: Partial<IScheduleType>;

  private selectedEventTypeCode$ = new BehaviorSubject<number>(null);
  private selectedEventTypeCodeSub: Subscription;

  private selectedPersonRoles$ = new BehaviorSubject<number>(null);
  private selectedPersonRolesSub: Subscription;

  private formControlsFactory = {
    eventTypeCode: {
      controlName: 'eventTypeCode',
      type: 'select',
      required: true,
      onChange: () => this.onEventTypeSelect()
    },
    personRoles: {
      controlName: 'personRoles',
      type: 'multiselect',
      required: true,
      onChange: () => this.onPersonRoleSelect(),
      width: 4
    },
    userId: {
      controlName: 'userId',
      type: 'gridselect',
      translationKey: 'default.filters.users',
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'fullName' },
        { prop: 'organization' },
        { prop: 'position' },
      ].map(c => ({ ...c, name: this.translateService.instant(`widgets.operator.grid.${c.prop}`) })),
      gridLabelGetter: row => row.fullName,
      gridValueGetter: row => row.id,
      required: true,
    },
    groupId: {
      controlName: 'groupId',
      type: 'gridselect',
      translationKey: 'widgets.scheduleEvents.card.changeGroupId',
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        {
          prop: 'entityTypeId',
          dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE,
          maxWidth: 90
        },
        { prop: 'name' },
        { prop: 'comment' },
      ].map(c => ({ ...c, name: this.translateService.instant(`widgets.groups.grid.${c.prop}`) })),
      gridLabelGetter: row => row.name || row.id,
      gridValueGetter: row => row.id,
      required: true,
      display: true
    },
    inactiveReasonCode: { controlName: 'inactiveReasonCode', type: 'select' },
    phoneTypes: { controlName: 'phoneTypes', type: 'multiselect', required: true, width: 4 },
    emailTypes: { controlName: 'emailTypes', type: 'multiselect', required: true, width: 4 },
    templateId: { controlName: 'templateId', type: 'select', required: true, width: 4 },
    checkGroup: { controlName: 'checkGroup', type: 'checkbox' },
    senderCode: { controlName: 'senderCode', type: 'select', required: true },
    dict1Code: { controlName: 'dict1Code', type: 'select', required: true },
    dict2Code: { controlName: 'dict2Code', type: 'select', required: true },
    dict3Code: { controlName: 'dict3Code', type: 'select', required: true },
    dict4Code: { controlName: 'dict4Code', type: 'select', required: true },
    modeCode: { controlName: 'modeCode', type: 'select', required: true },
    delay: { controlName: 'delay', type: 'number', min: 0, required: true },
    stage: { controlName: 'stage', type: 'select', required: true },
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private scheduleEventService: ScheduleEventService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.eventId ? this.scheduleEventService.canEdit$ : this.scheduleEventService.canView$,
      this.scheduleEventService.dictionaries$,
      this.scheduleEventService.getEventTemplateOptions(
        2,
        this.scheduleEventService.findEventAddParam<number[]>(this.type.additionalParameters, 'personRoles') || [1]
      ),
      this.scheduleEventService.getEventTemplateOptions(
        3,
        this.scheduleEventService.findEventAddParam<number[]>(this.type.additionalParameters, 'personRoles') || [1]
      ),
      this.scheduleEventService.constants$,
      this.scheduleEventService.fetchGroups(),
      this.scheduleEventService.fetchUsers()
    )
    .pipe(first())
    .subscribe(([canEdit, options, templateSmsOptions, templateEmailOptions, constants, groups, users]) => {
      const [ useSmsSender, useEmailSender, smsSender, emailSender ] = constants;
      const groupsByEntityType = this.scheduleEventService.getGroupsByEntityType(groups);

      this.formControlsFactory.groupId.display = !this.groupId;

      this.eventTypeControls = this.createEventTypeControls(canEdit);

      this.addParamsControls = [
        this.createChangeGroupTypeControls(canEdit, groups),
        this.createSendTypeControls(
          canEdit,
          groupsByEntityType[19],
          options[UserDictionariesService.DICTIONARY_PHONE_TYPE],
          options[UserDictionariesService.DICTIONARY_PERSON_ROLE],
          templateSmsOptions,
          useSmsSender.valueB && UserDictionariesService.DICTIONARY_SMS_SENDER,
          'phoneTypes'
        ),
        this.createSendTypeControls(
          canEdit,
          groupsByEntityType[19],
          options[UserDictionariesService.DICTIONARY_EMAIL_TYPE],
          options[UserDictionariesService.DICTIONARY_PERSON_ROLE],
          templateEmailOptions,
          useEmailSender.valueB && UserDictionariesService.DICTIONARY_EMAIL_SENDER,
          'emailTypes'

        ),
        ...Array.from(new Array(4), (v, i) =>
          this.createDictTypeControls(canEdit, groupsByEntityType[19], i + 1)
        ),
        this.createDebtStageTypeControls(canEdit, groupsByEntityType[19]),
        this.createChangeOperatorTypeControls(
          canEdit,
          groupsByEntityType[19],
          UserDictionariesService.DICTIONARY_ACCEPT_OPERATOR_MODE_CODE,
          users
        ),
        this.createChangeOperatorTypeControls(
          canEdit,
          groupsByEntityType[19],
          UserDictionariesService.DICTIONARY_CLEAR_OPERATOR_MODE_CODE
        ),
        this.createBlockTypeControls(
          canEdit,
          groupsByEntityType[21],
          UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING
        ),
        this.createBlockTypeControls(
          canEdit,
          groupsByEntityType[20],
          UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING
        ),
        this.createBlockTypeControls(
          canEdit,
          groupsByEntityType[22],
          UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING
        )
      ];

      this.addParamsData = {
        1: {
          senderCode: useSmsSender.valueB && smsSender.valueN,
          templateId: templateSmsOptions[0] && templateSmsOptions[0].value
        },
        2: {
          senderCode: useEmailSender.valueB && emailSender.valueN,
          templateId: templateEmailOptions[0] && templateEmailOptions[0].value
        }
      };

      this.selectedEventTypeCode$.next(this.type.eventTypeCode);
      this.selectedEventTypeCodeSub = this.selectedEventTypeCode$.subscribe(type => {
        this.selectedType = this.getFormData();
        this.cdRef.markForCheck();
      });

      this.selectedPersonRolesSub = this.selectedPersonRoles$
        .filter(Boolean)
        .flatMap(personRoles =>
          this.scheduleEventService.getEventTemplateOptions(this.selectedEventTypeCode, personRoles)
        )
        .subscribe(templateOptions => {
          this.setControlOptions(this.addParamsForm, 'templateId', templateOptions);
          this.cdRef.markForCheck();
        });

      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.selectedEventTypeCodeSub.unsubscribe();
    this.selectedPersonRolesSub.unsubscribe();
  }

  get selectedEventTypeCode(): number {
    return this.selectedEventTypeCode$.value;
  }

  get currentAddParamsForm(): number {
    return this.addParamsControls
      .indexOf(this.addParamsForm && this.addParamsForm.controls) + 1;
  }

  get isOriginalEventType(): boolean {
    return this.type.eventTypeCode === this.selectedEventTypeCode;
  }

  get eventTypeForms(): DynamicFormComponent[] {
    return [ this.eventTypeForm, this.addParamsForm ];
  }

  get canSubmit(): boolean {
    return this.selectedEventTypeCode === this.currentAddParamsForm
      && this.eventTypeForms.find(form => form && form.canSubmit)
      && this.eventTypeForms.map(dform => dform && dform.form).every(form => !form || form.valid);
  }

  get serializedUpdates(): IScheduleType {
    const formData = this.addParamsForm && this.addParamsForm.serializedValue;
    return this.serializeScheduleType(formData || {});
  }

  onEventTypeSelect(): void {
    const eventTypeControl = this.eventTypeForm.getControl('eventTypeCode');
    this.selectedEventTypeCode$.next(eventTypeControl.value);
  }

  onGroupSelect(group: IScheduleGroup): void {
    const groupIdControl = this.eventTypeForm.getControl('groupId');
    groupIdControl.setValue(group.id);
    groupIdControl.markAsDirty();
  }

  onPersonRoleSelect(): void {
    const personRoleControl = this.addParamsForm.getControl('personRoles');
    this.selectedPersonRoles$.next(personRoleControl.value);
  }

  private createFormControls(controls: any): Partial<IDynamicFormControl>[] {
    return Object.keys(controls).map(controlName => ({
      ...this.formControlsFactory[controlName],
      ...controls[controlName]
    }));
  }

  private createEventTypeControls(canEdit: boolean): Partial<IDynamicFormItem>[] {
    return this.createFormControls({
      eventTypeCode: {
        disabled: !canEdit,
        dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE,
        markAsDirty: !this.eventId
      },
    });
  }

  private createChangeGroupTypeControls(canEdit: boolean, groups: IScheduleGroup[]): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
    });
  }

  private createSendTypeControls(
    canEdit: boolean,
    groups: IScheduleGroup[],
    phoneOptions: IOption[],
    personRoleOptions: IOption[],
    templateOptions: IOption[],
    senderDictCode: number,
    contactControl: string,
  ): Partial<IDynamicFormControl>[] {
    const addControls = this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
      [contactControl]: { disabled: !canEdit, options: phoneOptions, markAsDirty: !this.eventId },
      personRoles: { disabled: !canEdit, options: personRoleOptions, markAsDirty: !this.eventId },
      templateId: { disabled: !canEdit, options: templateOptions, markAsDirty: !this.eventId },
      delay: { disabled: !canEdit },
      checkGroup: { disabled: !canEdit }
    });
    if (senderDictCode) {
      addControls.splice(addControls.length - 1, 0, ...this.createFormControls({
        senderCode: { disabled: !canEdit, dictCode: senderDictCode, markAsDirty: !this.eventId }
      }));
    }
    return addControls;
  }

  private createDictTypeControls(canEdit: boolean, groups: IScheduleGroup[], dictIndex: number): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
      [`dict${dictIndex}Code`]: {
        disabled: !canEdit,
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${dictIndex}`],
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private createDebtStageTypeControls(canEdit: boolean, groups: IScheduleGroup[]): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
      stage: {
        disabled: !canEdit,
        dictCode: UserDictionariesService.DICTIONARY_DEBT_STAGE_CODE,
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private createChangeOperatorTypeControls(
    canEdit: boolean,
    groups: IScheduleGroup[],
    modeDictCode: number,
    users?: IScheduleUser[],
  ): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
      ...(users ? { userId: { gridRows: users, disabled: !canEdit } } : {}),
      modeCode: {
        disabled: !canEdit,
        dictCode: modeDictCode,
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private createBlockTypeControls(canEdit: boolean, groups: IScheduleGroup[], dictCode: number): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      groupId: { gridRows: groups, disabled: !canEdit },
      inactiveReasonCode: {
        disabled: !canEdit,
        dictCode: dictCode,
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private getFormData(): any {
    return {
      ...this.getDefaultFormData(),
      ...(this.addParamsData[this.selectedEventTypeCode - 1] || {}),
      ...(this.isOriginalEventType ? this.type : {}),
      eventTypeCode: this.selectedEventTypeCode,
      ...(this.isOriginalEventType ? this.scheduleEventService.getEventAddParams(this.type) : {})
    };
  }

  private getDefaultFormData(): any {
    return {
      groupId: this.groupId,
      phoneTypes: [ 1 ],
      emailTypes: [ 1 ],
      personRoles: [ 1 ],
      [`dict${this.selectedEventTypeCode - 3}Code`]: 1,
      stage: 1,
      modeCode: 1,
      inactiveReasonCode: 1
    };
  }

  private serializeScheduleType(formData: any): IScheduleType {
    const additionalParameters = this.scheduleEventService.createEventAddParams(formData);
    return {
      ...this.eventTypeForm.serializedUpdates,
      groupId: formData.groupId,
      checkGroup: formData.checkGroup,
      ...(additionalParameters.length ? { additionalParameters } : {})
    };
  }

  private setControlOptions(form: DynamicFormComponent, controlName: string, options: IOption[]): void {
    const control = form.getFlatControls()
      .find(c => c.controlName === controlName) as IDynamicFormSelectControl;
    control.options = options;
    form.getControl(controlName).setValue(options[0] && options[0].value);
  }
}
