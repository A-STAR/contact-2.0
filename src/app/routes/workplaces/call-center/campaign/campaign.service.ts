import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface ICampaignRouteParams {
  campaignId: number;
}

@Injectable()
export class CampaignService {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get campaignId(): number {
    return this.routeParams.campaignId;
  }

  get routeParams(): ICampaignRouteParams {
    return (this.route.params as BehaviorSubject<ICampaignRouteParams>).value;
  }
}
