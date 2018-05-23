import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, mergeMap } from 'rxjs/operators';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { UserTemplatesService } from '@app/core/user/templates/user-templates.service';

import { valuesToOptions } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-auto-comment',
  templateUrl: 'auto-comment.component.html'
})
export class ContactRegistrationAutoCommentComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;

  private formSub: Subscription;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  ngOnInit(): void {
    this.formSub = combineLatest(
      this.contactRegistrationService.params$,
      this.formGroup.get('autoCommentId').valueChanges
    )
    .pipe(
      filter(([ params, autoCommentId ]) => params && autoCommentId),
      mergeMap(([ params, autoCommentId ]) => {
        const { campaignId, debtId, personId, personRole } = params;
        // If `campaignId` is a number (can also be 0) - the request is made from call center
        const callCenter = campaignId != null;
        return this.userTemplatesService.fetchMessageTemplateText(debtId, personId, personRole, autoCommentId, callCenter);
      }),
    )
    .subscribe(autoComment => this.formGroup.get('autoComment').patchValue(autoComment));
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  readonly autoCommentIdOptions$ = this.userTemplatesService.getTemplates(4, 0, false).pipe(map(valuesToOptions));

}
