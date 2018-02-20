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
import { IOption } from '@app/core/converter/value-converter.interface';

import { EmailService } from './email.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addFormLabel, toOption } from '@app/core/utils';

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

      const senderCode = defaultSender.valueN;

      this.controls = this.buildControls(
        filteredEmailOptions,
        templates.map(toOption('id', 'name')),
        Boolean(useSender.valueB),
        Boolean(senderCode),
      );

      if (senderCode) {
        this.data = { ...this.data, senderCode };
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

  private buildControls(
    emailOptions: IOption[],
    templateOptions: IOption[],
    useSender: boolean,
    isSenderPresent: boolean,
  ): IDynamicFormControl[] {

    const controls: IDynamicFormControl[] = [
      {
        controlName: 'startDateTime',
        markAsDirty: true,
        minDateTime: moment().subtract(3, 'd').toDate(),
        required: true,
        type: 'datetimepicker',
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
        markAsDirty: useSender && isSenderPresent,
        required: useSender,
        type: 'singleselect',
      },
    ]
    .map(addFormLabel('widgets.mass.email.form'));

    return controls;
  }
}
