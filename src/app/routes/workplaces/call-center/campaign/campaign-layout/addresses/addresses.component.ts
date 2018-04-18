import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';

import { CampaignService } from '../../campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-call-center-addresses',
  templateUrl: 'addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  constructor(
    private campaignService: CampaignService,
    private contactRegistrationService: ContactRegistrationService,
    private route: ActivatedRoute,
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

  get personRole(): number {
    return 1;
  }

  get contactType(): number {
    return 3;
  }

  onAddressAdd(): void {
    this.personId$
      .pipe(first())
      .subscribe(personId => {
        this.routingService.navigate([ `address/${personId}/create` ], this.route);
      });
  }

  onAddressEdit(address: IAddress): void {
    this.personId$
      .pipe(first())
      .subscribe(personId => {
        this.routingService.navigate([ `address/${personId}/${address.id}` ], this.route);
      });
  }

  onAddressRegister(address: IAddress): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => this.contactRegistrationService.startRegistration({
        campaignId: this.campaignId,
        contactId: address.id,
        contactType: this.contactType,
        debtId: debt.debtId,
        personId: debt.personId,
        personRole: this.personRole,
      }));
  }
}
