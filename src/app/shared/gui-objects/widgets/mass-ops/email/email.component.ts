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

import { EmailService } from './email.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '../../../../../core/user/templates/user-templates.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { minDateThreeDaysAgo } from '../../../../../core/validators';
import { addFormLabel, toOption } from '../../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-email',
  templateUrl: 'email.component.html'
})
export class EmailComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() debtIds: number[];
  @Input() personIds: number[];
  @Input() personRoles: number[];

  @Output() close = new EventEmitter<void>();

  controls: IDynamicFormControl[];

  data: any = {
    startDateTime: new Date(),
  };

  constructor (
    private cdRef: ChangeDetectorRef,
    private emailService: EmailService,
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
      this.userTemplatesService.getTemplates(3, this.personRoles[0]),
      this.userDictionaryService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.userConstantsService.get('Email.Sender.Default'),
      this.userConstantsService.get('Email.Sender.Use'),
    )
    .pipe(first())
    .subscribe(([ templates, emailOptions, defaultSender, useSender ]) => {
      const filteredEmailOptions = emailOptions
        .filter(option => this.userPermissionsService.contains('EMAIL_MASS_EMAIL_TYPE_LIST', Number(option.value)));

      this.controls = this.buildControls(filteredEmailOptions, templates.map(toOption('id', 'name')), Boolean(useSender.valueB));

      if (defaultSender.valueN) {
        this.data.senderCode = defaultSender.valueN;
      }

      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const email = this.form.serializedUpdates;
    this.emailService
      .schedule(this.debtIds, this.personIds, Number(this.personRoles[0]), email)
      .subscribe(() => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(emailOptions: IOption[], templateOptions: IOption[], useSender: boolean): IDynamicFormControl[] {
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
        controlName: 'emailTypes',
        options: emailOptions,
        required: true,
        type: 'multiselect',
      },
      {
        controlName: 'subject',
        required: true,
        type: 'text',
      },
      {
        controlName: 'templateId',
        options: templateOptions,
        required: true,
        type: 'select',
      },
      {
        controlName: 'senderCode',
        dictCode: UserDictionariesService.DICTIONARY_EMAIL_SENDER,
        display: useSender,
        markAsDirty: useSender,
        required: useSender,
        type: 'selectwrapper',
      },
    ]
    .map(addFormLabel('widgets.mass.email.form'));
  }
}
