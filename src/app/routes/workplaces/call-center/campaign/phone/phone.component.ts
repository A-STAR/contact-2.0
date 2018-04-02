import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { RoutingService } from '@app/core/routing/routing.service';

interface PhoneCardRouteParams {
  personId: number;
  phoneId: number;
}

@Component({
  selector: 'app-call-center-phone',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.pipe(map(params => params.phoneId));
  }

  get entityId$(): Observable<number> {
    return this.routeParams$.pipe(map(params => params.personId));
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }

  onClose(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.routingService.navigate([ `/app/workplaces/call-center/${campaignId}` ]);
  }
}
