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
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IOption, INamedValue } from '../../../../../core/converter/value-converter.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { SmsService} from './sms.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '../../../../../core/user/templates/user-templates.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { minDateThreeDaysAgo } from '../../../../../core/validators';
import { addFormLabel, toOption } from '../../../../../core/utils';

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
    private actionGridFilterService: ActionGridFilterService,
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
    this.personRole = Number(this.actionGridFilterService.getAddOption(this.actionData, 'personRole', 0));

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
        minDate: new Date(),
        required: true,
        type: 'datetimepicker',
        validators: [ minDateThreeDaysAgo() ],
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
        type: 'singleselectwrapper',
      },
    ]
    .map(addFormLabel('widgets.mass.sms.form'));
  }
}
