import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '../../contact-registration.service';
import { map } from 'rxjs/operators/map';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-comment',
  templateUrl: 'comment.component.html'
})
export class ContactRegistrationCommentComponent {
  @Input() formGroup: FormGroup;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly isCommentRequired$: Observable<boolean> = this.contactRegistrationService.outcome$
    .pipe(
      map(outcome => outcome && outcome.commentMode === 3),
    );
}
