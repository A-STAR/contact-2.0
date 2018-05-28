import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-status-change',
  templateUrl: 'status-change.component.html'
})
export class ContactRegistrationStatusChangeComponent {
  @Input() formGroup: FormGroup;

  statusChangeReasonDictCode = UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly isChangeReasonRequired$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => outcome && outcome.statusReasonMode === 3)
  );
}
