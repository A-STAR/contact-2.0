import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import * as moment from 'moment';

import { IOption } from '../../../../../../../core/converter/value-converter.interface';
import { IPerson } from '../../../../../../../routes/workplaces/debt-processing/debtor/debtor.interface';
import { IUserConstant } from '../../../../../../../core/user/constants/user-constants.interface';

import { UserConstantsService } from '../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../core/user/dictionaries/user-dictionaries.service';

import { IDynamicFormControl } from '../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { ISMSSchedule } from '../../../phone.interface';

import { makeKey } from '../../../../../../../core/utils';
import { minDate } from '../../../../../../../core/validators';

const labelKey = makeKey('widgets.phone.dialogs.schedule.form');

@Component({
  selector: 'app-phone-grid-schedule-form',
  templateUrl: './phone-grid-schedule-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleFormComponent implements OnInit, OnDestroy {
  @Input() debtId: number;
  @Input() person: IPerson;
  @Input() phoneId: number;

  private minStartDateTime = moment().subtract(3, 'd').toDate();

  controls: IDynamicFormControl[];
  data: Partial<ISMSSchedule> = {
    startDateTime: new Date()
  };

  private _formSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    console.log(this.debtId, this.person, this.phoneId);

    this._formSubscription = Observable.combineLatest(
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_SENDER),
    ).subscribe(([ defaultSender, useSender, options ]) => {
      this.initControls(useSender, options);
      if (options.find(option => option.value === defaultSender.valueN)) {
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
  }

  private initControls(useSender: IUserConstant, options: IOption[]): void {
    this.controls = [
      {
        label: labelKey('senderCode'),
        controlName: 'senderCode',
        type: useSender.valueB ? 'select' : 'hidden',
        required: true,
        options
      },
      {
        label: labelKey('startDateTime'),
        controlName: 'startDateTime',
        type: 'datepicker',
        displayTime: true,
        minDate: this.minStartDateTime,
        validators: [ minDate(this.minStartDateTime) ]
      },
      {
        label: labelKey('text'),
        controlName: 'text',
        type: 'textarea',
        rows: 5
      },
    ];
  }
}
