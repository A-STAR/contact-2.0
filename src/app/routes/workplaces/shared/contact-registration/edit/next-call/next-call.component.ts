import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { ContactRegistrationService } from '../../contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-next-call',
  templateUrl: 'next-call.component.html'
})
export class ContactRegistrationNextCallComponent {
  @Input() formGroup: FormGroup;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly isNextCallDateRequired$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.nextCallMode === 3),
  );

  get nextCallMinDate(): Date {
    return moment().toDate();
  }

  readonly nextCallMaxDate$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.nextCallDays),
      map(nextCallDays => nextCallDays ? moment().add(nextCallDays, 'day').toDate() : null)
  );
}
