import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { EmailService } from '../email.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.email.card');

@Component({
  selector: 'app-email-card',
  templateUrl: './email-card.component.html'
})
export class EmailCardComponent implements OnInit {
  @Input() emailId: number;
  @Input() entityId: number;
  @Input() entityType = 18;

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  email: any;

  constructor(
    private contentTabService: ContentTabService,
    private emailService: EmailService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.emailId ? this.userPermissionsService.has('EMAIL_EDIT') : Observable.of(true),
      this.emailId ? this.userPermissionsService.has('EMAIL_COMMENT_EDIT') : Observable.of(true),
      this.emailId ? this.emailService.fetch(this.entityType, this.entityId, this.emailId) : Observable.of(null)
    )
    .pipe(first())
    .subscribe(([ options, canEdit, canEditComment, email ]) => {
      this.controls = [
        { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: labelKey('email'), controlName: 'email', type: 'text', required: true, disabled: !canEdit },
        { label: labelKey('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.email = email;
    });
  }

  public onSubmit(): void {
    const action = this.emailId
      ? this.emailService.update(this.entityType, this.entityId, this.emailId, this.form.serializedUpdates)
      : this.emailService.create(this.entityType, this.entityId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.emailService.dispatchSaveAction();
      this.onBack();
    });
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
