import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';
import * as moment from 'moment';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IOption, INamedValue } from '@app/core/converter/value-converter.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { SmsService} from './sms.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addFormLabel, toOption } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-sms',
  templateUrl: 'sms.component.html'
})
export class SmsComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  data: any = {
    startDateTime: new Date(),
  };

  private personRole: number;

  constructor (
    private actionGridService: ActionGridService,
    private cdRef: ChangeDetectorRef,
    private smsService: SmsService,
    private userConstantsService: UserConstantsService,
    private userDictionaryService: UserDictionariesService,
    private userTemplatesService: UserTemplatesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get isFormDisabled(): boolean {
    return !this.form || !this.form.canSubmit;
  }

  ngOnInit(): void {
    this.personRole = Number(this.actionGridService.getAddOption(this.actionData, 'personRole', 0));

    combineLatest(
      this.userTemplatesService.getTemplates(2, this.personRole),
      this.userDictionaryService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
    )
    .pipe(first())
    .subscribe(([ templates, phoneOptions, defaultSender, useSender ]) => {
      const filteredPhoneOptions = phoneOptions
        .filter(option => this.userPermissionsService.contains('SMS_MASS_PHONE_TYPE_LIST', Number(option.value)));

      const senderCode = defaultSender.valueN;

      this.controls = this.buildControls(
        filteredPhoneOptions,
        templates.map(toOption<INamedValue>('id', 'name')),
        Boolean(useSender.valueB),
        Boolean(senderCode),
      );

      if (senderCode) {
        this.data.senderCode = senderCode;
      }

      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const sms = this.form.serializedUpdates;
    this.smsService
      .schedule(this.actionData.payload, this.personRole, sms)
      .subscribe(() => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(
    phoneOptions: IOption[],
    templateOptions: IOption[],
    useSender: boolean,
    isSenderPresent: boolean,
  ): IDynamicFormControl[] {
    return [
      {
        controlName: 'startDateTime',
        markAsDirty: true,
        minDate: moment().subtract(3, 'd').toDate(),
        required: true,
        type: 'datetimepicker',
      },
      {
        controlName: 'phoneTypes',
        options: phoneOptions,
        type: 'multiselect',
        required: true,
      },
      {
        controlName: 'templateId',
        options: templateOptions,
        required: true,
        type: 'select',
      },
      {
        controlName: 'senderCode',
        dictCode: UserDictionariesService.DICTIONARY_SMS_SENDER,
        display: useSender,
        markAsDirty: useSender && isSenderPresent,
        required: useSender,
        type: 'select',
      },
    ]
    .map(addFormLabel('widgets.mass.sms.form'));
  }
}
