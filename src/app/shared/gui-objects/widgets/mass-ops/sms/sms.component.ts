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

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { SmsService} from './sms.service';
import { UserConstantsService } from 'app/core/user/constants/user-constants.service';
import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from 'app/core/user/templates/user-templates.service';
import { UserPermissionsService } from 'app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { toOption } from '../../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-sms',
  templateUrl: 'sms.component.html'
})
export class SmsComponent implements OnInit {
  @Input() debtIds: number[];
  @Input() personIds: number[];
  @Input() personRoles: number[];

  @Output() close = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  data: any = {
    startDateTime: new Date(),
  };

  constructor (
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
    combineLatest(
      this.userTemplatesService.getTemplates(2, this.personRoles[0]),
      this.userDictionaryService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.userConstantsService.get('SMS.Sender.Default'),
      this.userConstantsService.get('SMS.Sender.Use'),
    )
    .pipe(first())
    .subscribe(([ templates, phoneOptions, defaultSender, useSender ]) => {
      const filteredPhoneOptions = phoneOptions
        .filter(option => this.userPermissionsService.contains('SMS_MASS_PHONE_TYPE_LIST', Number(option.value)));

      this.controls = this.buildControls(filteredPhoneOptions, templates.map(toOption('id', 'name')), Boolean(useSender.valueB));

      if (defaultSender.valueN) {
        this.data.senderCode = defaultSender.valueN;
      }

      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const email = this.form.serializedUpdates;
    this.smsService
      .schedule(this.debtIds, this.personIds, this.personRoles, email)
      .subscribe(() => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(phoneOptions: IOption[], templateOptions: IOption[], useSender: boolean): IDynamicFormControl[] {
    return [
      {
        controlName: 'startDateTime',
        displayTime: true,
        label: 'startDateTime',
        markAsDirty: true,
        required: true,
        type: 'datepicker',
      },
      {
        controlName: 'phoneTypes',
        label: 'phoneTypes',
        options: phoneOptions,
        type: 'multiselect',
      },
      {
        controlName: 'templateId',
        label: 'templateId',
        options: templateOptions,
        required: true,
        type: 'select',
      },
      {
        controlName: 'senderCode',
        dictCode: UserDictionariesService.DICTIONARY_SMS_SENDER,
        display: useSender,
        label: 'senderCode',
        markAsDirty: useSender,
        required: useSender,
        type: 'selectwrapper',
      },
    ];
  }
}
