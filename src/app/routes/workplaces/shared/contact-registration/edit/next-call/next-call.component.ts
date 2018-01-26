import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
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

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.nextCallMode)),
    );
  }

  get isNextCallDateRequired$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.nextCallMode === 3),
    );
  }

  get nextCallMinDate(): Date {
    return moment().toDate();
  }

  get nextCallMaxDate$(): Observable<Date> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && outcome.nextCallDays),
      map(nextCallDays => moment().add(nextCallDays, 'day').toDate())
    );
  }
}
