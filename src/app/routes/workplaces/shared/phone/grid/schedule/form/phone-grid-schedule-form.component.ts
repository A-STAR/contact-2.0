import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { INamedValue, IOption } from '@app/core/converter/value-converter.interface';
import { ISMSSchedule } from '../../../phone.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, valuesToOptions } from '@app/core/utils';
import { minDate } from '@app/core/validators';

const labelKey = makeKey('widgets.phone.dialogs.schedule.form');

@Component({
  selector: 'app-phone-grid-schedule-form',
  templateUrl: './phone-grid-schedule-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleFormComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() debtId: number;
  @Input() personId: number;
  @Input() personRole: number;
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
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = combineLatest(
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_SENDER),
      this.useTemplate ?
        this.userTemplatesService.getTemplatesForDebt(2, this.personRole, true, this.debtId) :
        of(null)
    )
    .pipe(first())
    .subscribe(([ defaultSender, useSender, senderOptions, templates ]) => {
      this.initControls(useSender, senderOptions, templates);
      this.cdRef.detectChanges();
      if (this.useTemplate) {
        this._templateIdSubscription = this.form.getControl('templateId')
          .valueChanges
          .distinctUntilChanged()
          .subscribe(() => this.fetchTemplateText());
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
        type: 'datetimepicker',
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
    const { templateId } = this.form.serializedUpdates;
    this.userTemplatesService.fetchMessageTemplateText(this.debtId, this.personId, this.personRole, templateId, false)
      .subscribe(text => {
        this.data = {
          ...this.form.value,
          text
        };
        this.cdRef.markForCheck();
      });
  }
}
