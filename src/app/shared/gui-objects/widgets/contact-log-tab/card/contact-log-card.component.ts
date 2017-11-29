import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
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
export class ContactLogTabCardComponent implements OnInit {
  @Input() contactId: number;
  @Input() debtId: number;
  @Input() contactLogType: number;

  @ViewChild('form') form: DynamicFormComponent;

  // private routeParams = (<any>this.route.params).value;
  // private contactId = this.routeParams.contactLogId;
  // private debtId = this.routeParams.debtId;
  // private contactLogType = this.routeParams.contactLogType;

  controls: Array<IDynamicFormItem> = null;
  contactLog: IContactLog;

  constructor(
    private contentTabService: ContentTabService,
    private contactLogService: ContactLogService,
    private cdRef: ChangeDetectorRef,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userPermissionsService.has('CONTACT_COMMENT_EDIT'),
      Observable.of(this.contactLogType),
      this.contactId ? this.contactLogService.fetch(this.debtId, this.contactId, this.contactLogType) : Observable.of(null),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_CONTACT_TYPE),
      Number(this.contactLogType) === 4 ?
        this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE)
        : Observable.of(null),
      Number(this.contactLogType) === 4 ?
         this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_STATUS)
        : Observable.of(null)
    )
    .pipe(first())
    .subscribe(([ canEditComment, contactLogType, contactLog, contactTypeOpts, roleOpts, smsStatusOpts ]) => {
      this.controls = this
        .initControls(
          contactTypeOpts,
          contactLogType,
          roleOpts,
          smsStatusOpts,
          canEditComment,
          contactLog,
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
    contactLogType: number,
    roleOpts: IOption[],
    smsStatusOpts: IOption[],
    canEditComment: boolean,
    contactLog: IContactLog
  ): Array<IDynamicFormItem> {
    if (Number(contactLogType) !== 4) {
      let contactNumber, promiseAmount;
      const baseControls = [
        { label: label('contract'), controlName: 'contract',
          type: 'text',  width: 6, disabled: true },
        { label: label('contactDateTime'), controlName: 'contactDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('contactType'), controlName: 'contactType', type: 'select',
          width: 6, options: contactTypeOptions, disabled: true },
        { label: label('userFullName'), controlName: 'userFullName', type: 'text',
          width: 6, disabled: true },
        { label: label('resultName'), controlName: 'resultName', type: 'text',
          width: 6, disabled: true },
        { label: label('contactData'), controlName: 'contactData',
          type: 'text', width: 6, disabled: true },
      ];

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
        type: 'textarea', width: 12, disabled: !canEditComment
      };

       return [...baseControls, promiseAmount, comment].filter(Boolean) as IDynamicFormItem[];
    }

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
        type: 'textarea', width: 12, disabled: true },
    ];
  }
}



