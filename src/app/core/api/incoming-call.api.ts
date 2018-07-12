import { Injectable } from '@angular/core';
import { RoutingService } from '@app/core/routing/routing.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class IncomingCallApiService {

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) { }

  openIncomingCallCard(params?: any): Promise<boolean> {
    return this.routingService.navigate([ `/app/workplaces/incoming-call/main` ], this.route, params);
  }
}
