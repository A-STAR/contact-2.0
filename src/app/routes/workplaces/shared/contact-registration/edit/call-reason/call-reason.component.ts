import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '../../contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-call-reason',
  templateUrl: 'call-reason.component.html'
})
export class ContactRegistrationCallReasonComponent {
  @Input() formGroup: FormGroup;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetCallReason$;
  }

  get isCallReasonRequired$(): Observable<boolean> {
    return this.contactRegistrationService.isCallReasonRequired$;
  }
}
