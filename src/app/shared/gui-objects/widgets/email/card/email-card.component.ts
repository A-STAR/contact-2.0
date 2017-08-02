import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { EmailService } from '../email.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-email-card',
  templateUrl: './email-card.component.html'
})
export class EmailCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private emailId = (this.route.params as any).value.emailId || null;

  controls: Array<IDynamicFormItem> = null;
  email: any;

  constructor(
    private contentTabService: ContentTabService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.userPermissionsService.has('EMAIL_EDIT'),
      this.userPermissionsService.has('EMAIL_COMMENT_EDIT'),
      // TODO(d.maltsev): pass entity type
      this.emailId ? this.emailService.fetch(18, this.id, this.emailId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, canEdit, canEditComment, email ]) => {
      this.controls = [
        { label: 'widgets.email.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: 'widgets.email.card.email', controlName: 'email', type: 'text', required: true, disabled: !canEdit },
        { label: 'widgets.email.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.email = email;
    });
  }

  public onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode
    }

    const action = this.emailId
      ? this.emailService.update(18, this.id, this.emailId, data)
      : this.emailService.create(18, this.id, data);

    action.subscribe(() => this.onBack());
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
