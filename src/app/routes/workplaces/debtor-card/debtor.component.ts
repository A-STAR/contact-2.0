import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ActivatedRoute } from '@angular/router';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

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
export class DebtorComponent implements OnInit, OnDestroy {
  private routeIdSubscription: Subscription;

  readonly displayContactRegistration$ = this.contactRegistrationService.isActive$;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeIdSubscription = this.route.paramMap
      .subscribe(paramMap => {
        const debtId = Number(paramMap.get('debtId'));
        const debtorId = Number(paramMap.get('debtorId'));
        if (Number.isInteger(debtId)) {
          this.debtorService.debtId$.next(debtId);
        }
        if (Number.isInteger(debtorId)) {
          this.debtorService.debtorId$.next(debtorId);
        }
    });
  }

  ngOnDestroy(): void {
    this.routeIdSubscription.unsubscribe();
  }
}
