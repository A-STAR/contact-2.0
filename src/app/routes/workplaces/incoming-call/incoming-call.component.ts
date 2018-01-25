import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { IncomingCallService } from './incoming-call.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactRegistrationService,
    IncomingCallService,
  ],
  selector: 'app-incoming-call',
  templateUrl: 'incoming-call.component.html',
})
export class IncomingCallComponent {
  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get displayContactRegistration$(): Observable<boolean> {
    return this.contactRegistrationService.isActive$;
  }
}
