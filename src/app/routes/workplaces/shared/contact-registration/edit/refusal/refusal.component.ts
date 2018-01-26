import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetRefusal$;
  }
}
