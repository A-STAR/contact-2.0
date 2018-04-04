import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-size' },
  providers: [
    ContactRegistrationService,
  ],
  selector: 'app-debtor',
  styleUrls: [ './debtor.component.scss' ],
  templateUrl: './debtor.component.html',
})
export class DebtorComponent {
  constructor(
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  readonly displayContactRegistration$ = this.contactRegistrationService.isActive$;
}
