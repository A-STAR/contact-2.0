import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IContactLog } from '../contact-log.interface';
import { IDynamicFormControl, IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContactLogService } from '../contact-log.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.contactLog.card');

@Component({
  selector: 'app-contact-log-card',
  templateUrl: './contact-log-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLogTabCardComponent implements OnInit {
  @Input() callCenter = false;
  @Input() contactId: number;
  @Input() debtId: number;
  @Input() disabled = false;
  @Input() contactLogType: number;

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  contactLog: IContactLog;

  constructor(
    private contentTabService: ContentTabService,
    private contactLogService: ContactLogService,
    private cdRef: ChangeDetectorRef,
    private messageBusService: MessageBusService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userPermissionsService.has('CONTACT_COMMENT_EDIT'),
      Observable.of(this.contactLogType),
      this.contactId
        ? this.contactLogService.fetch(this.debtId, this.contactId, this.contactLogType, this.callCenter)
        : Observable.of(null),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTACT_TYPE),
      this.personRole,
      this.statusOptions
    )
    .pipe(first())
    .subscribe(([ canEditComment, contactLogType, contactLog, contactTypeOpts, roleOpts, statusOpts ]) => {
      this.contactLog = contactLog;
      this.controls = this
        .initControls(
          contactTypeOpts,
          contactLogType,
          roleOpts,
          statusOpts,
          canEditComment,
          contactLog,
        );
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    this.contactLogService.update(this.debtId, this.contactId, this.form.value.comment)
      .subscribe(() => {
        this.messageBusService.dispatch(ContactLogService.COMMENT_CONTACT_LOG_SAVED, null, this.contactId );
        this.onBack();
      });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  private createDefaultControls(
    contactTypeOptions: IOption[],
    contactLog: IContactLog,
    canEditComment: boolean
  ): IDynamicFormItem[] {
    let contactNumber, promiseAmount;
    const baseControls = [
      { controlName: 'contract', type: 'text',  width: 6, disabled: true },
      { controlName: 'contactDateTime', type: 'datepicker', width: 6, disabled: true },
      { controlName: 'contactType', type: 'select', width: 6, options: contactTypeOptions, disabled: true },
      { controlName: 'userFullName', type: 'text', width: 6, disabled: true },
      { controlName: 'resultName', type: 'text', width: 6, disabled: true },
      { controlName: 'contactData', type: 'text', width: 6, disabled: true },
    ].map(item => ({ ...item, label: label(item.controlName) } as IDynamicFormControl));

    if (contactLog.promiseDate) {
      contactNumber = {
        label: label('contactNumber'), controlName: 'contactNumber',
        type: 'text', width: 6, disabled: true
      };
    }

    if (contactLog.promiseAmount) {
      promiseAmount = {
        label: label('promiseAmount'), controlName: 'promiseAmount',
        type: 'text', width: 6, disabled: true
      };
    }

    const comment = {
      label: label('comment'), controlName: 'comment',
      type: 'textarea', width: 12, disabled: !canEditComment || this.disabled
    };

    return [...baseControls, promiseAmount, comment].filter(Boolean) as IDynamicFormItem[];
  }

  private createSMSControls(roleOpts: IOption[], statusOpts: IOption[]): IDynamicFormItem[] {
    return [
      { label: label('contract'), controlName: 'contract', type: 'number',  width: 6, disabled: true },
      { label: label('userFullName'), controlName: 'userFullName', type: 'text', width: 6,  disabled: true },
      { label: label('sentDateTime'), controlName: 'sentDateTime', type: 'datepicker', width: 6, disabled: true },
      { label: label('startDateTime'), controlName: 'startDateTime', type: 'datepicker', width: 6, disabled: true },
      { label: label('fullName'), controlName: 'fullName', type: 'text', width: 6, disabled: true },
      { label: label('contactPhone'), controlName: 'contactPhone', type: 'text', width: 6, disabled: true },
      { label: label('personRole'), controlName: 'personRole', options: roleOpts, width: 6, disabled: true, type: 'select'},
      { label: label('status'), controlName: 'status', options: statusOpts, width: 6, disabled: true, type: 'select'},
      { label: label('text'), controlName: 'text', type: 'textarea', width: 12, disabled: true },
    ];
  }

  private createEmailControls(roleOpts: IOption[], statusOpts: IOption[]): IDynamicFormItem[] {
    return [
      { label: label('contract'), controlName: 'contract', type: 'number',  width: 6, disabled: true },
      { label: label('userFullName'), controlName: 'userFullName', type: 'text', width: 6,  disabled: true },
      { label: label('sentDateTime'), controlName: 'sentDateTime', type: 'datepicker', width: 6, disabled: true },
      { label: label('startDateTime'), controlName: 'startDateTime', type: 'datepicker', width: 6, disabled: true },
      { label: label('fullName'), controlName: 'fullName', type: 'text', width: 6, disabled: true },
      { label: label('contactEmail'), controlName: 'contactEmail', type: 'text', width: 6, disabled: true },
      { label: label('personRole'), controlName: 'personRole', options: roleOpts, width: 6, disabled: true, type: 'select'},
      { label: label('status'), controlName: 'status', options: statusOpts, width: 6, disabled: true, type: 'select'},
      { label: label('text'), controlName: 'text', type: 'richtexteditor',
        width: 12, disabled: true, toolbar: this.contactLog.formatCode === 1 },
    ];
  }

  private get statusOptions(): Observable<IOption[]> {
    switch (this.contactLogType) {
      case ContactLogService.CONTACT_TYPE_SMS:
        return this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_STATUS);
      case ContactLogService.CONTACT_TYPE_EMAIL:
        return this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_STATUS);
      default:
        return Observable.of(null);
    }
  }

  private get personRole(): Observable<IOption[]> {
    switch (this.contactLogType) {
      case ContactLogService.CONTACT_TYPE_SMS:
      case ContactLogService.CONTACT_TYPE_EMAIL:
        return this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE);
      default:
        return Observable.of(null);
    }
  }

  private initControls(
    contactTypeOptions: IOption[],
    contactLogType: number,
    roleOpts: IOption[],
    statusOpts: IOption[],
    canEditComment: boolean,
    contactLog: IContactLog
  ): IDynamicFormItem[] {

    switch (contactLogType) {
      case ContactLogService.CONTACT_TYPE_SMS:
        return this.createSMSControls(roleOpts, statusOpts);
      case ContactLogService.CONTACT_TYPE_EMAIL:
        return this.createEmailControls(roleOpts, statusOpts);
      default:
        return this.createDefaultControls(contactTypeOptions, contactLog, canEditComment);
    }
  }
}



