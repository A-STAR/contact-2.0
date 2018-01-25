import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

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
  ) {}

  ngOnInit(): void {
    this.formSub = this.formGroup.get('autoCommentId').valueChanges.subscribe(value => {
      // TODO(d.maltsev): fetch autocomment
      console.log(value);
    });
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetAutoCommentId$;
  }
}
