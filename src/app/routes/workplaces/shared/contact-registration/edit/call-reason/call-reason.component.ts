import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-call-reason',
  templateUrl: 'call-reason.component.html'
})
export class ContactRegistrationCallReasonComponent {
  @Input() formGroup: FormGroup;

  private callReasonDictCode = UserDictionariesService.DICTIONARY_CALL_REASON;

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
