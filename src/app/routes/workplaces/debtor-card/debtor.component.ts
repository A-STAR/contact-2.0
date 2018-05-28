import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs/operators/filter';
import { Subscription } from 'rxjs/Subscription';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

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
  private routeNavigateSub: Subscription;

  readonly displayContactRegistration$ = this.contactRegistrationService.isActive$;

  constructor(
    private contactRegistrationService: ContactRegistrationService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const debtorId = Number(this.route.snapshot.paramMap.get('debtorId'));
    const debtId = Number(this.route.snapshot.paramMap.get('debtId'));

    this.onDebtorIdChange(debtorId);
    this.onDebtIdChange(debtId);

    this.routeNavigateSub = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => this.onNavigationEnd(event as NavigationEnd));
  }

  onNavigationEnd(event: NavigationEnd): void {
    const urlSegment = event.url.split('/').slice(3, 7);

    const debtorIdx = urlSegment.indexOf('debtor');
    const debtIdx = urlSegment.indexOf('debt');

    if (debtorIdx !== -1) {
      const debtorId = Number(urlSegment[debtorIdx + 1]);
      this.onDebtorIdChange(debtorId);
    }

    if (debtIdx !== -1) {
      const debtId = Number(urlSegment[debtIdx + 1]);
      this.onDebtIdChange(debtId);
    }
  }

  ngOnDestroy(): void {
    this.routeNavigateSub.unsubscribe();
  }

  private onDebtorIdChange(debtorId: number): void {
    if (this.debtorService.debtorId$.value !== debtorId) {
      this.debtorService.debtorId$.next(debtorId);
    }
  }

  private onDebtIdChange(debtId: number): void {
    if (this.debtorService.debtId$.value !== debtId) {
      this.debtorService.debtId$.next(debtId);
    }
  }
}
