import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-debt-reason',
  templateUrl: 'debt-reason.component.html'
})
export class ContactRegistrationDebtReasonComponent {
  @Input() formGroup: FormGroup;

  debtReasonDictCode = UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly isDebtReasonCodeRequired$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.debtReasonMode === 3)
  );
}
