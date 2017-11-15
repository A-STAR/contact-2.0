import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ICampaign } from './call-center.interface';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';

// import { DataService } from '../../../core/data/data.service';
// import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class CallCenterService {
  private _campaigns$ = new BehaviorSubject<ICampaign[]>(null);

  constructor(
    private contentTabService: ContentTabService,
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {
    this.fetchCampaigns().subscribe(campaigns => {
      this._campaigns$.next(campaigns);
      if (campaigns && campaigns.length === 1) {
        this.navigateToCampaign(campaigns[0]);
      }
    });
  }

  get campaigns$(): Observable<any[]> {
    return this._campaigns$;
  }

  navigateToCampaign(campaign: ICampaign): void {
    this.contentTabService.navigate(`/workplaces/call-center/${campaign.id}`);
  }

  private fetchCampaigns(): Observable<ICampaign[]> {
    return Observable.of([
      { id: 1, name: 'Campaign 1', comment: '' },
      { id: 2, name: 'Campaign 2', comment: '' },
    ]);

    // TODO(d.maltsev): uncomment when API is ready
    // return this.dataService.readAll('/userCampaigns')
    //   .catch(this.notificationsService.fetchError().entity('entities.campaign.gen.plural').dispatchCallback());
  }
}
