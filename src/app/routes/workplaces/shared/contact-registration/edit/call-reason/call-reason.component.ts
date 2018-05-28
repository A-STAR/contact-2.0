import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-call-reason',
  templateUrl: 'call-reason.component.html'
})
export class ContactRegistrationCallReasonComponent {
  @Input() formGroup: FormGroup;

  callReasonDictCode = UserDictionariesService.DICTIONARY_CALL_REASON;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly isCallReasonRequired$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.callReasonMode === 3)
  );
}
