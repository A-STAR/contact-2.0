import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import * as moment from 'moment';

import { IDynamicFormControl } from '../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { INamedValue, IOption } from '../../../../../../../core/converter/value-converter.interface';
import { IPerson } from '../../../../../../../routes/workplaces/debt-processing/debtor/debtor.interface';
import { ISMSSchedule } from '../../../phone.interface';
import { IUserConstant } from '../../../../../../../core/user/constants/user-constants.interface';

import { PhoneService } from '../../../phone.service';
import { UserConstantsService } from '../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey, valuesToOptions } from '../../../../../../../core/utils';
import { minDate } from '../../../../../../../core/validators';

const labelKey = makeKey('widgets.phone.dialogs.schedule.form');

@Component({
  selector: 'app-phone-grid-schedule-form',
  templateUrl: './phone-grid-schedule-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleFormComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() debtId: number;
  @Input() person: IPerson;
  @Input() phoneId: number;
  @Input() useTemplate: boolean;

  controls: IDynamicFormControl[];
  data: ISMSSchedule = {
    senderCode: null,
    startDateTime: new Date()
  };

  private _formSubscription: Subscription;
  private _templateIdSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private phoneService: PhoneService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = Observable.combineLatest(
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_SENDER),
      this.useTemplate ?
        this.phoneService.fetchSMSTemplates(2, 1, true) :
        Observable.of(null)
    ).subscribe(([ defaultSender, useSender, senderOptions, templates ]) => {
      this.initControls(useSender, senderOptions, templates);
      this.cdRef.detectChanges();
      if (this.useTemplate) {
        this._templateIdSubscription = this.form.getControl('templateId').valueChanges.subscribe(() => this.fetchTemplateText());
      }
      if (senderOptions.find(option => option.value === defaultSender.valueN)) {
        this.data = {
          ...this.data,
          senderCode: defaultSender.valueN
        };
      }
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
    if (this.useTemplate) {
      this._templateIdSubscription.unsubscribe();
    }
  }

  private initControls(useSender: IUserConstant, senderOptions: IOption[], templates: INamedValue[]): void {
    const smsControl = this.useTemplate
      ? [
          {
            label: labelKey('templateId'),
            controlName: 'templateId',
            type: 'select',
            options: valuesToOptions(templates),
            required: true,
          }
        ]
      : [];

    const useSenderControl = useSender.valueB
      ? [
          {
            label: labelKey('senderCode'),
            controlName: 'senderCode',
            type: 'select',
            required: true,
            options: senderOptions,
          }
        ]
      : [];

    this.controls = [
      ...smsControl,
      ...useSenderControl,
      {
        label: labelKey('startDateTime'),
        controlName: 'startDateTime',
        type: 'datepicker',
        displayTime: true,
        minDate: new Date(),
        validators: [ minDate(moment().subtract(3, 'd').toDate()) ],
        required: true
      },
      {
        label: labelKey('text'),
        controlName: 'text',
        type: 'textarea',
        rows: 5,
        disabled: this.useTemplate,
        required: true
      },
    ] as IDynamicFormControl[];
  }

  private fetchTemplateText(): void {
    this.phoneService.fetchMessageTemplateText(this.debtId, this.person.id, 1, this.form.serializedUpdates.templateId)
      .subscribe(text => {
        this.data = {
          ...this.data,
          text
        };
        this.cdRef.markForCheck();
      });
  }
}
