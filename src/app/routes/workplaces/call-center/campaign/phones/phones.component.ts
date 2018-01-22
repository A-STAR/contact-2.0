import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators/first';

import { IPhone } from '@app/routes/workplaces/shared/phone/phone.interface';

import { CampaignService } from '../campaign.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-call-center-phones',
  templateUrl: 'phones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesComponent {
  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService,
  ) {}

  get campaignId(): number {
    return this.campaignService.campaignId;
  }

  get debtExists$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.map(Boolean);
  }

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.debtId);
  }

  get personId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.personId);
  }

  get contactType(): number {
    return 1;
  }

  get personRole(): number {
    return 1;
  }

  onPhoneAdd(): void {
    this.personId$
      .pipe(first())
      .subscribe(personId => this.routingService.navigate([ `phone/${personId}/create` ], this.route));
  }

  onPhoneEdit(phone: IPhone): void {
    this.personId$
      .pipe(first())
      .subscribe(personId => this.routingService.navigate([ `phone/${personId}/${phone.id}` ], this.route));
  }

  onPhoneRegister(phone: IPhone): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => {
        const url = `/workplaces/contact-registration/${debt.debtId}/${this.contactType}/${phone.id}`;
        this.router.navigate([ url ], { queryParams: {
          personId: debt.personId,
          personRole: this.personRole,
        } });
      });
  }
}
