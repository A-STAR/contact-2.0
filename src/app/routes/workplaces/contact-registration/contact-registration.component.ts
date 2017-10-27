import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ContactRegistrationService } from './contact-registration.service';

import { combineLatestOr } from '../../../core/utils/helpers';

@Component({
  selector: 'app-contact-registration',
  templateUrl: './contact-registration.component.html',
  styleUrls: [ './contact-registration.component.scss' ],
  providers: [
    ContactRegistrationService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRegistrationComponent {
  static COMPONENT_NAME = 'ContactRegistrationComponent';

  debtId = Number(this.routeParams.debtId);
  contactTypeCode = Number(this.routeParams.contactTypeCode);
  contactId = Number(this.routeParams.contactId);
  personId = Number(this.queryParams.personId);
  personRole = Number(this.queryParams.personRole);

  selectedIndex = 0;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private route: ActivatedRoute,
  ) {}

  get routeParams(): any {
    return (this.route.params as any).value;
  }

  get queryParams(): any {
    return (this.route.queryParams as any).value;
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

  get canAddPromise$(): Observable<boolean> {
    return this.contactRegistrationService.canAddPromise$;
  }

  get canAddPayment$(): Observable<boolean> {
    return this.contactRegistrationService.canAddPayment$;
  }

  get canAddPhone$(): Observable<boolean> {
    return this.contactRegistrationService.canAddPhone$;
  }

  get canAddFile$(): Observable<boolean> {
    return this.contactRegistrationService.canAddFile$;
  }

  get canAddAttributes$(): Observable<boolean> {
    return this.contactRegistrationService.isInvalid$.map(isInvalid => !isInvalid);
  }

  get canAddMisc$(): Observable<boolean> {
    return combineLatestOr([
      this.contactRegistrationService.canAddNextCall$,
      this.contactRegistrationService.canAddComment$,
      this.contactRegistrationService.canAddAutoComment$,
      this.contactRegistrationService.canAddDebtReason$,
      this.contactRegistrationService.canAddRefusal$,
      this.contactRegistrationService.canAddCallReason$,
      this.contactRegistrationService.canAddStatusChangeReason$,
    ]);
  }

  get canConfirm$(): Observable<boolean> {
    return this.contactRegistrationService.isInvalid$.map(isInvalid => !isInvalid);
  }

  onSubmit(): void {
    this.contactRegistrationService.confirm(this.debtId).subscribe(console.log);
  }
}
