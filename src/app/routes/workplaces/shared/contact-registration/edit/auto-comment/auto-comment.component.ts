import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map, mergeMap } from 'rxjs/operators';

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
      this.formGroup.get('autoCommentId').valueChanges.pipe(
        map(item => item[0].value),
      ),
    )
    .pipe(
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

  get autoCommentIdOptions$(): Observable<any[]> {
    return this.userTemplatesService.getTemplates(4, 0, false).pipe(map(valuesToOptions));
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAutoCommentId$;
  }
}
