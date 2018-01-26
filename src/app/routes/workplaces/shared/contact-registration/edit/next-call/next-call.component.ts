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
    return this.contactRegistrationService.canSetNextCallDate$;
  }

  get isNextCallDateRequired$(): Observable<boolean> {
    return this.contactRegistrationService.isNextCallDateRequired$;
  }

  get nextCallMaxDate$(): Observable<Date> {
    return this.contactRegistrationService.nextCallDays$.pipe(
      map(nextCallDays => moment().add(nextCallDays, 'day').toDate()),
    );
  }
}
