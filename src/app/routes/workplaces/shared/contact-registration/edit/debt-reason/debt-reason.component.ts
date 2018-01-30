import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
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

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.debtReasonMode))
    );
  }

  get isDebtReasonCodeRequired$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.debtReasonMode === 3)
    );
  }
}
