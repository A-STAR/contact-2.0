import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { DebtorService } from './debtor.service';

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
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtorCardService: DebtorCardService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeIdSubscription = this.route.paramMap
      .subscribe(paramMap => {
        const debtId   = Number(paramMap.get('debtId'));
        const debtorId = Number(paramMap.get('debtorId'));
        if (debtId) {
          this.debtorCardService.initByDebtId(debtId);
        }
        this.debtorService.addTab(debtorId, debtId);
        this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.routeIdSubscription.unsubscribe();
  }

  get debtors(): any {
    return Array.from(this.debtorService.debtors).map(debtor => debtor.split(':'));
  }
}
