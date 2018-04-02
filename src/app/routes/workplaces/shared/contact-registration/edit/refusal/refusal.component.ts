import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

import { ContactRegistrationService } from '../../contact-registration.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-refusal',
  templateUrl: 'refusal.component.html'
})
export class ContactRegistrationRefusalComponent {
  @Input() formGroup: FormGroup;

  statusChangeReasonDictCode = UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly canDisplayForm$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.isRefusal === 1),
  );
}
