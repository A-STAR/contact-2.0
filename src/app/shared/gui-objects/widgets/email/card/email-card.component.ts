import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form.interface';

import { EmailService } from '../email.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../core/utils';
import { first } from 'rxjs/operators';

const labelKey = makeKey('widgets.email.card');

@Component({
  selector: 'app-email-card',
  templateUrl: './email-card.component.html'
})
export class EmailCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private id = (this.route.params as any).value.personId || null;
  private emailId = (this.route.params as any).value.emailId || null;

  controls: Array<IDynamicFormItem> = null;
  email: any;

  constructor(
    private emailService: EmailService,
    private messageBusService: MessageBusService,
    private router: Router,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.emailId ? this.userPermissionsService.has('EMAIL_EDIT') : Observable.of(true),
      this.emailId ? this.userPermissionsService.has('EMAIL_COMMENT_EDIT') : Observable.of(true),
      // TODO(d.maltsev): pass entity type
      this.emailId ? this.emailService.fetch(18, this.id, this.emailId) : Observable.of(null)
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
      ? this.emailService.update(18, this.id, this.emailId, this.form.serializedUpdates)
      : this.emailService.create(18, this.id, this.form.serializedUpdates);

    action.subscribe(() => {
      this.messageBusService.dispatch(EmailService.MESSAGE_EMAIL_SAVED);
      this.onBack();
    });
  }

  public onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
