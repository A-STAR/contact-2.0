import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import {
  IDynamicFormItem, IDynamicFormConfig, IDynamicFormSelectControl, IDynamicFormControl
} from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ScheduleEventEnum, IScheduleGroup, IScheduleType, IScheduleUser } from '../../schedule-event.interface';

import { ScheduleEventService } from '../../schedule-event.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from '@app/shared/components/grid/grid.component';

import { min } from '@app/core/validators';

@Component({
  selector: 'app-schedule-type-card',
  templateUrl: './schedule-type-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleTypeCardComponent implements OnInit, OnDestroy {
  @ViewChild('eventType') eventTypeForm: DynamicFormComponent;
  @ViewChild('addParams') addParamsForm:  DynamicFormComponent;
  @ViewChild('groupGrid') groupGrid: GridComponent;

  @Input() eventId: number;
  @Input() type: IScheduleType;

  eventTypeControls: Partial<IDynamicFormItem>[];
  eventTypeConfig: IDynamicFormConfig = {
    labelKey: 'widgets.scheduleEvents.card',
  };

  addParamsControls: Array<Partial<IDynamicFormControl>[]>;

  selectedType: Partial<IScheduleType>;

  private selectedEventTypeCode$ = new BehaviorSubject<number>(null);
  private selectedEventTypeCodeSub: Subscription;

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
      gridColumns: [
        { prop: 'id', width: 70 },
        { prop: 'fullName' },
        { prop: 'organization' },
        { prop: 'position' },
      ],
      gridLabelGetter: row => row.fullName,
      gridValueGetter: row => row.id,
      required: true,
    },
    groupId: {
      controlName: 'groupId',
      type: 'gridselect',
      gridColumns: [
        { prop: 'id', width: 70 },
        { name: 'entityTypeCode', prop: 'entityTypeId', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE, width: 90 },
        { prop: 'name' },
        { prop: 'comment' },
      ],
      gridLabelGetter: row => row.name,
      gridValueGetter: row => row.id,
      required: true,
    },
    phoneTypes: { controlName: 'phoneTypes', type: 'multiselect', required: true, width: 4 },
    templateId: { controlName: 'templateId', type: 'select', required: true, width: 4 },
    delay: { controlName: 'delay', type: 'number', required: true, validators: [ min(1) ] },
    checkGroup: { controlName: 'checkGroup', type: 'checkbox' },
    senderCode: { controlName: 'senderCode', type: 'select', required: true, width: 4 },
    dict1Code: { controlName: 'dict1Code', type: 'select', required: true },
    dict2Code: { controlName: 'dict2Code', type: 'select', required: true },
    dict3Code: { controlName: 'dict3Code', type: 'select', required: true },
    dict4Code: { controlName: 'dict4Code', type: 'select', required: true },
    stage: { controlName: 'stage', type: 'select', required: true },
    modeCode: { controlName: 'modeCode', type: 'select', required: true },
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
    private userDictionaryService: UserDictionariesService,
    private scheduleEventService: ScheduleEventService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.eventId ? this.scheduleEventService.canEdit$ : this.scheduleEventService.canView$,
      this.userDictionaryService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PHONE_TYPE,
        UserDictionariesService.DICTIONARY_EMAIL_TYPE,
        UserDictionariesService.DICTIONARY_PERSON_ROLE,
      ]),
      this.scheduleEventService.getEventTemplateOptions(2, this.type.additionalParameters),
      this.scheduleEventService.getEventTemplateOptions(3, this.type.additionalParameters),
      combineLatest(
        this.userConstantsService.get('SMS.Sender.Use'),
        this.userConstantsService.get('Email.Sender.Use'),
        this.userConstantsService.get('SMS.Sender.Default'),
        this.userConstantsService.get('Email.Sender.Default'),
      ),
      this.scheduleEventService.fetchGroups(),
      this.scheduleEventService.fetchUsers()
    )
    .pipe(first())
    .subscribe(([canEdit, options, templateSmsOptions, templateEmailOptions, constants, groups, users]) => {
      const [ useSmsSender, useEmailSender, smsSender, emailSender ] = constants;

      this.eventTypeControls = this.createEventTypeControls(canEdit, groups);

      this.addParamsControls = [
        [],
        this.createSendTypeControls(
          canEdit,
          options[UserDictionariesService.DICTIONARY_PHONE_TYPE],
          options[UserDictionariesService.DICTIONARY_PERSON_ROLE],
          templateSmsOptions, useSmsSender.valueB
        ),
        this.createSendTypeControls(
          canEdit,
          options[UserDictionariesService.DICTIONARY_EMAIL_TYPE],
          options[UserDictionariesService.DICTIONARY_PERSON_ROLE],
          templateEmailOptions,
          useEmailSender.valueB
        ),
        ...Array.from(new Array(4), (v, i) => this.createDictTypeControls(canEdit, i + 1)),
        this.createDebtStageTypeControls(canEdit),
        this.createChangeOperatorTypeControls(canEdit, users)
      ];

      this.selectedEventTypeCode$.next(this.type.eventTypeCode);
      this.selectedEventTypeCodeSub = this.selectedEventTypeCode$
        .subscribe(() => {
         this.selectedType = this.getFormData(
            useSmsSender.valueB && smsSender.valueN,
            useEmailSender.valueB && emailSender.valueN
          );
          this.cdRef.markForCheck();
        });

      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.selectedEventTypeCodeSub.unsubscribe();
  }

  get selectedEventTypeCode(): ScheduleEventEnum {
    return this.selectedEventTypeCode$.value;
  }

  get isOriginalEventType(): boolean {
    return this.type.eventTypeCode === this.selectedEventTypeCode;
  }

  get eventTypeForms(): DynamicFormComponent[] {
    return [ this.eventTypeForm, this.addParamsForm ];
  }

  get canSubmit(): boolean {
    return !!this.eventTypeForms.find(form => form && form.canSubmit)
      && this.eventTypeForms.map(dform => dform.form).every(form => !form || form.valid);
  }

  get serializedUpdates(): IScheduleType {
    const formData = this.addParamsForm && this.addParamsForm.serializedValue;
    return this.serializeScheduleType(formData || {});
  }

  onEventTypeSelect(): void {
    const [ eventTypeControl ] = this.eventTypeForm.getControl('eventTypeCode').value;
    this.selectedEventTypeCode$.next(eventTypeControl.value);
  }

  onGroupSelect(group: IScheduleGroup): void {
    const groupIdControl = this.eventTypeForm.getControl('groupId');
    groupIdControl.setValue(group.id);
    groupIdControl.markAsDirty();
  }

  onPersonRoleSelect(): void {
    const personRoleControl = this.addParamsForm.getControl('personRoles');
    this.scheduleEventService.getEventTemplateOptions(
      this.selectedEventTypeCode,
      this.scheduleEventService.createEventAddParams({ personRoles: personRoleControl.value })
    ).subscribe(templateOptions => {
      this.setControlOptions(this.addParamsForm, 'templateId', templateOptions);
      this.cdRef.markForCheck();
    });
  }

  private createFormControls(controls: any): Partial<IDynamicFormControl>[] {
    return Object.keys(controls).map(controlName => ({
      ...this.formControlsFactory[controlName],
      ...controls[controlName]
    }));
  }

  private createEventTypeControls(canEdit: boolean, groups: IScheduleGroup[]): Partial<IDynamicFormItem>[] {
    return this.createFormControls({
      eventTypeCode: { disabled: !canEdit, dictCode: UserDictionariesService.DICTIONARY_SCHEDULE_EVENT_TYPE },
      groupId: { gridRows: groups, disabled: !canEdit },
    });
  }

  private createSendTypeControls(
    canEdit: boolean,
    phoneOptions: IOption[],
    personRoleOptions: IOption[],
    templateOptions: IOption[],
    useSender: boolean
  ): Partial<IDynamicFormControl>[] {
    const addControls = this.createFormControls({
      phoneTypes: { disabled: !canEdit, options: phoneOptions, markAsDirty: !this.eventId },
      personRoles: { disabled: !canEdit, options: personRoleOptions, markAsDirty: !this.eventId },
      templateId: { disabled: !canEdit, options: templateOptions, markAsDirty: !this.eventId },
      delay: { disabled: !canEdit, width: useSender ? 4 : 12 },
    });

    if (useSender) {
      addControls.push(...this.createFormControls({
        senderCode: { disabled: !canEdit, dictCode: UserDictionariesService.DICTIONARY_SMS_SENDER, markAsDirty: !this.eventId }
      }));
    }

    addControls.push(...this.createFormControls({
      checkGroup: { disabled: !canEdit }
    }));

    return addControls;
  }

  private createDictTypeControls(canEdit: boolean, dictIndex: number): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      [`dict${dictIndex}Code`]: {
        disabled: !canEdit,
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${dictIndex}`],
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private createDebtStageTypeControls(canEdit: boolean): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      stage: {
        disabled: !canEdit,
        dictCode: UserDictionariesService.DICTIONARY_DEBT_STAGE_CODE,
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private createChangeOperatorTypeControls(canEdit: boolean, users: IScheduleUser[]): Partial<IDynamicFormControl>[] {
    return this.createFormControls({
      userId: { gridRows: users, disabled: !canEdit },
      modeCode: {
        disabled: !canEdit,
        dictCode: UserDictionariesService.DICTIONARY_OPERATOR_MODE_CODE,
        markAsDirty: !this.eventId
      },
      checkGroup: { disabled: !canEdit }
    });
  }

  private getFormData(smsSender: number, emailSender: number): any {
    return {
      ...this.getDefaultFormData(smsSender, emailSender),
      ...(this.isOriginalEventType ? this.type : {}),
      eventTypeCode: this.selectedEventTypeCode,
      ...(this.isOriginalEventType ? this.scheduleEventService.getEventAddParams(this.type) : {})
    };
  }

  private getDefaultFormData(smsSender: number, emailSender: number): any {
    switch (this.selectedEventTypeCode) {
      case ScheduleEventEnum.GROUP:
        return {};
      case ScheduleEventEnum.SMS:
        return {
          phoneTypes: [ 1 ],
          personRoles: [ 1 ],
          senderCode: smsSender,
        };
      case ScheduleEventEnum.EMAIL:
        return {
          phoneTypes: [ 1 ],
          personRoles: [ 1 ],
          senderCode: emailSender,
        };
      case ScheduleEventEnum.DICT1CODE:
      case ScheduleEventEnum.DICT2CODE:
      case ScheduleEventEnum.DICT3CODE:
      case ScheduleEventEnum.DICT4CODE:
        return {
          [`dict${this.selectedEventTypeCode - 3}Code`]: 1
        };
      case ScheduleEventEnum.DEBTSTAGE:
        return { stage: 1 };
      case ScheduleEventEnum.USERCHANGE:
        return { modeCode: 1 };
    }
  }

  private serializeScheduleType(fromData: any): IScheduleType {
    const additionalParameters = this.scheduleEventService.createEventAddParams(fromData);
    return {
      ...this.eventTypeForm.serializedUpdates,
      checkGroup: fromData.checkGroup,
      ...(additionalParameters.length ? { additionalParameters } : {})
    };
  }

  private setControlOptions(form: DynamicFormComponent, controlName: string, options: IOption[]): void {
    const control = form.getFlatControls()
      .find(c => c.controlName === controlName) as IDynamicFormSelectControl;
    control.options = options;
    form.getControl(controlName).setValue('');
  }
}
