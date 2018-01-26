import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '../../contact-registration.service';

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

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetComment$;
  }

  get isCommentRequired$(): Observable<boolean> {
    return this.contactRegistrationService.isCommentRequired$;
  }
}
