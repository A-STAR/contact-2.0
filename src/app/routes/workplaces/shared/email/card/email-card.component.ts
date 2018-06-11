import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';

import { EntityType } from '@app/core/entity/entity.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { EmailService } from '@app/routes/workplaces/core/email/email.service';
import { RoutingService } from '@app/core/routing/routing.service';
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

  private routeData = this.route.snapshot.data;
  private parentUrl = this.routeData.parentUrl;
  private entityKey = this.routeData.entityKey;

  private params = this.route.snapshot.paramMap;
  private emailId = Number(this.params.get('emailId'));
  private personId = Number(this.params.get(this.entityKey));

  private entityType = EntityType.PERSON;

  constructor(
    private cdRef: ChangeDetectorRef,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMAIL_TYPE),
      this.emailId ? this.userPermissionsService.has('EMAIL_EDIT') : of(true),
      this.emailId ? this.userPermissionsService.has('EMAIL_COMMENT_EDIT') : of(true),
      this.emailId ? this.emailService.fetch(this.entityType, this.personId, this.emailId) : of(null)
    )
    .pipe(first())
    .subscribe(([ options, canEdit, canEditComment, email ]) => {
      this.controls = [
        { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { label: labelKey('email'), controlName: 'email', type: 'text', required: true, disabled: !canEdit },
        { label: labelKey('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      ];
      this.email = email;
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const action = this.emailId
      ? this.emailService.update(this.entityType, this.personId, this.emailId, this.form.serializedUpdates)
      : this.emailService.create(this.entityType, this.personId, this.form.serializedUpdates);

    action.subscribe(() => {
      this.emailService.dispatchSaveAction();
      this.onBack();
    });
  }

  onBack(): void {
    if (this.parentUrl) {
      this.routingService.navigateToUrl(this.parentUrl);
    } else {
      this.routingService.navigateToParent(this.route);
    }
  }


  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
