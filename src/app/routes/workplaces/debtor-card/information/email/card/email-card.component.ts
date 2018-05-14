import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { EmailService } from '../email.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.email.card');

@Component({
  selector: 'app-debtor-email-card',
  templateUrl: './email-card.component.html'
})
export class DebtorEmailCardComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  email: any;

  private emailId: number;
  private entityId: number;
  private entityType = 18;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.emailId$,
      this.entityId$
    )
    .flatMap(([ emailId, entityId ]) =>
      combineLatest(
        of(emailId),
        of(entityId),
        this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
        emailId ? this.userPermissionsService.has('EMAIL_EDIT') : of(true),
        emailId ? this.userPermissionsService.has('EMAIL_COMMENT_EDIT') : of(true),
        emailId ? this.emailService.fetch(this.entityType, entityId, emailId) : of(null)
      )
    )
    .pipe(first())
    .subscribe(([ emailId, entityId, options, canEdit, canEditComment, email ]) => {
      this.emailId = emailId;
      this.entityId = entityId;
      this.controls = [
        { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: labelKey('email'), controlName: 'email', type: 'text', required: true, disabled: !canEdit },
        { label: labelKey('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.email = email;
      this.cdRef.markForCheck();
    });
  }

  get emailId$(): Observable<number> {
    return this.route.params.map(params => params.emailId);
  }

  get entityId$(): Observable<number> {
    return combineLatest(this.debtorService.debtorId$, this.route.params)
      .map(([ personId, params ]) => params.contactId || personId);
  }

  onSubmit(): void {
    const action = this.emailId
      ? this.emailService.update(this.entityType, this.entityId, this.emailId, this.form.serializedUpdates)
      : this.emailService.create(this.entityType, this.entityId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.emailService.dispatchSaveAction();
      this.onBack();
    });
  }

  onBack(): void {
    const url = this.router.url.split('/').filter(Boolean).slice(0, -2).join('/');
    this.router.navigate([ url ]);
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
