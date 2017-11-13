import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

import { invert, isEmpty } from '../../../core/utils';

@Injectable()
export class CallCenterService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  get shouldSelectCampaign$(): Observable<boolean> {
    return this.dataService.readAll('/userCampaigns')
      .catch(this.notificationsService.fetchError().entity('entities.campaign.gen.plural').dispatchCallback())
      .map(isEmpty)
      .map(invert);
  }
}
