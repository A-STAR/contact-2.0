import { Component, ViewChild, OnInit } from '@angular/core';
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
  templateUrl: './contact-log-card.component.html'
})
export class ContactLogCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  private personId = (this.route.params as any).value.personId || null;
  private contactId= (this.route.params as any).value.contactId || null;

  controls: Array<IDynamicFormItem> = null;
  contactLog: IContactLog;

  constructor(
    private contentTabService: ContentTabService,
    private contactLogService: ContactLogService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userPermissionsService.has('CONTACT_COMMENT_EDIT'),
      this.contactId ? this.contactLogService.fetch(this.personId, this.contactId, 1) : Observable.of(null),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROPERTY_TYPE),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE),
    )
    .take(1)
    .subscribe(([ canEditComment, contactLog, contactTypeOpts, roleOpts ]) => {
      this.controls = this
      .initControls(
        contactTypeOpts,
        roleOpts,
        canEditComment,
        contactLog.contactType,
        contactLog
      );
      this.contactLog = contactLog;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const action =  this.contactLogService.update(this.personId, this.contactId, this.form.requestValue);

    action.subscribe(() => {
      this.messageBusService.dispatch(ContactLogService.COMMENT_CONTACT_LOG_SAVED );
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  private initControls(
    contactTypeOptions: IOption[],
    roleOpts: IOption[],
    canEditComment: boolean,
    contactType: number,
    contactLog: IContactLog
  ): Array<IDynamicFormItem> {
    if (contactType < 4) {
      const contactDataControlName: string = contactLog.contactType < 3
              ? 'contactData.address.full_addres'
              : 'contactData.phone.phone',
            promiseDate: Date | string = contactLog.promiseDate,
            promiseAmount: number = contactLog.promiseAmount;

      return [
        { label: label('contactNumber'),
          controlName: 'contactNumber',
          type: 'text', width: 6, disabled: true },
        { label: label('contactDateTime'),
          controlName: 'contactDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('contactType'),
          controlName: 'contactType',
          type: 'select', width: 6, options: contactTypeOptions, disabled: true },
        { label: label('userFullName'), controlName: 'userFullName', type: 'select',
          options: [{value: contactLog.userFullName, label: contactLog.userFullName}],
          disabled: true },
        { label: label('resultName'), controlName: 'resultName', type: 'text', width: 6, disabled: true },
        { label: label('contactData'),
          controlName: contactDataControlName,
          type: 'text', width: 6, disabled: true },
        promiseDate
          ? {
            label: label('promiseDate'), controlName: 'promiseDate', type: 'datepicker',
            width: 6, disabled: true
          }
          : undefined,
        promiseAmount
          ? {
            label: label('promiseAmount'), controlName: 'promiseAmount', type: 'number',
            width: 6, disabled: true
          }
          : undefined,
        { label: label('comment'),
          controlName: 'comment',
          type: 'text', width: 6, disabled: !canEditComment }
      ];
    } else {
      return [
        { label: label('contactNumber'),
          controlName: 'contactNumber',
          type: 'text', width: 6, disabled: true },
        { label: label('userFullName'), controlName: 'userFullName', type: 'select',
          options: [{value: contactLog.userFullName, label: contactLog.userFullName}],
          disabled: true },
        { label: label('personRole'),
          controlName: 'personRole',
          type: 'text', width: 6, options: roleOpts, disabled: true },
        { label: label('sentDateTime'),
          controlName: 'sentDateTime',
          type: 'datepicker', width: 6, disabled: true },
        { label: label('contactPhone'),
          controlName: 'contactPhone',
          type: 'text', width: 6, disabled: true },
        { label: label('text'),
          controlName: 'text',
          type: 'text', width: 6 , disabled: true },
        { label: label('status'),
          controlName: 'status',
          type: 'text', width: 6, disabled: true},
        { label: label('userFullName'), controlName: 'userFullName', type: 'select',
          options: [{value: contactLog.userFullName, label: contactLog.userFullName}],
          disabled: true },
        { label: label('startDateTime'),
          controlName: 'startDateTime',
          type: 'datepicker', width: 6, disabled: true },
      ];
    }
  }

  // private getFormData(): IContactLog {
  //   return {
  //     contactType: 1
  //   };
  // }
}
