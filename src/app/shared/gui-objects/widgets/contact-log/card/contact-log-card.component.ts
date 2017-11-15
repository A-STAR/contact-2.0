import {  ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IContactLog } from '../contact-log.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';
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
export class ContactLogCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  private contactId = (this.route.params as any).value.contactLogId || null;
  private debtId = (this.route.params as any).value.debtId || null;
  private contactLogType = (this.route.params as any).value.contactLogType || null;

  controls: Array<IDynamicFormItem> = null;
  contactLog: IContactLog;

  constructor(
    private contentTabService: ContentTabService,
    private contactLogService: ContactLogService,
    private messageBusService: MessageBusService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userPermissionsService.has('CONTACT_COMMENT_EDIT'),
      this.contactId ? this.contactLogService.fetch(this.debtId, this.contactId, this.contactLogType) : Observable.of(null),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTACT_TYPE),
      Number(this.contactLogType) === 4 ?
        this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE)
        : Observable.of(null),
      Number(this.contactLogType) === 4 ?
         this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_STATUS)
        : Observable.of(null)
    )
    .take(1)
    .subscribe(([ canEditComment, contactLog, contactTypeOpts, roleOpts, smsStatusOpts ]) => {
      this.controls = this
        .initControls(
          contactTypeOpts,
          roleOpts,
          smsStatusOpts,
          canEditComment,
          contactLog.contactType,
          contactLog
        );
      this.contactLog = contactLog;
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

  private initControls(
    contactTypeOptions: IOption[],
    roleOpts: IOption[],
    smsStatusOpts: IOption[],
    canEditComment: boolean,
    contactType: number,
    contactLog: IContactLog
  ): Array<IDynamicFormItem> {
    if (Number(contactType) !== 4) {
      const controls =  [
        { label: label('contract'), controlName: 'contract',
          type: 'number',  width: 6, disabled: true },
        { label: label('contactDateTime'), controlName: 'contactDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('contactType'), controlName: 'contactType', type: 'select',
          width: 6, options: contactTypeOptions, disabled: true },
        { label: label('userFullName'), controlName: 'userFullName', type: 'text',
          width: 6, disabled: true },
        { label: label('resultName'), controlName: 'resultName', type: 'text',
          width: 6, disabled: true },
        { label: label('contactData'), controlName: 'contactData',
          type: 'text', width: 6, disabled: true }];

      if (contactLog.promiseDate) {
        controls.push(
          { label: label('contactNumber'), controlName: 'contactNumber',
            type: 'text', width: 6, disabled: true },
        );
      }

      if (contactLog.promiseAmount) {
        controls.push(
          { label: label('promiseAmount'), controlName: 'promiseAmount',
            type: 'text', width: 6, disabled: true}
        );
      }

      controls.push(
         { label: label('comment'),
           controlName: 'comment',
           type: 'text', width: 12, disabled: !canEditComment }
       );

       return controls as IDynamicFormItem[];

    } else {

      return [
        { label: label('contract'), controlName: 'contract',
          type: 'number',  width: 6, disabled: true },
        { label: label('userFullName'), controlName: 'userFullName', type: 'text',
          width: 6,  disabled: true },
        { label: label('sentDateTime'), controlName: 'sentDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('startDateTime'), controlName: 'startDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('fullName'), controlName: 'fullName', type: 'text',
          width: 6, disabled: true },
        { label: label('contactPhone'), controlName: 'contactPhone',
          type: 'text', width: 6, disabled: true },
        { label: label('personRole'), controlName: 'personRole', options: roleOpts,
          width: 6, disabled: true, type: 'select'},
        { label: label('status'), controlName: 'status', options: smsStatusOpts,
          width: 6, disabled: true, type: 'select'},
        { label: label('text'), controlName: 'text',
          type: 'text', width: 12, disabled: true },
      ];
    }
  }
}



