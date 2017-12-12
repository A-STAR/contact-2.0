import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { IDynamicFormControl } from '../../../../../../components/form/dynamic-form/dynamic-form.interface';
import { INamedValue, IOption } from '../../../../../../../core/converter/value-converter.interface';
import { IEmailSchedule } from '../../../email.interface';
import { IUserConstant } from '../../../../../../../core/user/constants/user-constants.interface';

import { UserConstantsService } from '../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '../../../../../../../core/user/templates/user-templates.service';

import { DynamicFormComponent } from '../../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey, valuesToOptions } from '../../../../../../../core/utils';
import { minDate } from '../../../../../../../core/validators';

const labelKey = makeKey('widgets.email.dialogs.schedule.form');

@Component({
  selector: 'app-email-grid-schedule-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() debtId: number;
  @Input() emailId: number;
  @Input() personId: number;
  @Input() personRole: number;
  @Input() useTemplate: boolean;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  data: IEmailSchedule = {
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
    this._formSubscription = Observable.combineLatest(
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_SMS_SENDER),
      this.useTemplate ?
        this.userTemplatesService.getTemplates(2, 1, true) :
        Observable.of(null)
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
