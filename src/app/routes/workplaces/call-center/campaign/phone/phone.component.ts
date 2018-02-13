import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoutingService } from '@app/core/routing/routing.service';

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

  onClose(): void {
    this.routingService.navigate([
      '/workplaces',
      'call-center',
      this.route.snapshot.paramMap.get('campaignId')
    ]);
  }
}
