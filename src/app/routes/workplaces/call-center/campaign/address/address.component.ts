import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { RoutingService } from '@app/core/routing/routing.service';

interface AddressCardRouteParams {
  addressId: number;
  personId: number;
}

@Component({
  selector: 'app-call-center-address',
  templateUrl: 'address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {}

  get addressId$(): Observable<number> {
    return this.routeParams$.pipe(map(params => params.addressId));
  }

  get entityId$(): Observable<number> {
    return this.routeParams$.pipe(map(params => params.personId));
  }

  get routeParams$(): Observable<AddressCardRouteParams> {
    return this.route.params as Observable<AddressCardRouteParams>;
  }

  onClose(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.routingService.navigate([ `/workplaces/call-center/${campaignId}` ]);
  }
}
