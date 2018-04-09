import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { ActivatedRoute } from '@angular/router';

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
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeIdSubscription = this.route.paramMap
      .subscribe(paramMap => {
        const debtId = paramMap.get('debtId');
        if (debtId) {
          this.debtorCardService.initByDebtId(Number(debtId));
        }
    });
  }

  ngOnDestroy(): void {
    this.routeIdSubscription.unsubscribe();
  }
}
