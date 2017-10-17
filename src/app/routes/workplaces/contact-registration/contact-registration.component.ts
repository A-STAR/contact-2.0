import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from './contact-registration.service';

import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
  styleUrls: [ './contact-registration.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationComponent {
  static COMPONENT_NAME = 'ContactRegistrationComponent';

  steps: MenuItem[] = [
    { label: null },
    { label: null },
  ]

  debtId = Number(this.routeParams.debtId);
  contactTypeCode = Number(this.routeParams.contactTypeCode);

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private route: ActivatedRoute,
  ) {}

  get routeParams(): any {
    return (this.route.params as any).value;
  }

  get step(): number {
    return this.contactRegistrationService.step;
  }

  set step(step: number) {
    this.contactRegistrationService.step = step;
  }

  get isInvalid$(): Observable<boolean> {
    return this.contactRegistrationService.isInvalid$;
  }
}
