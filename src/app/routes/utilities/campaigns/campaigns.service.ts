import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data/data.service';
import { ICampaign } from './campaigns.interface';
import { IAppState } from '../../../core/state/state.interface';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class CampaignsService {
  static CAMPAIGN_SELECT = 'CAMPAIGN_SELECT';
  static PARTICIPANT_SELECT = 'PARTICIPANT_SELECT';
  public baseUrl = '/campaigns';
  constructor(private store: Store<IAppState>,
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  fetchCampaigns(): Observable<ICampaign[]> {
    return this.readCampaigns()
      .catch(
      this.notificationsService.error('errors.default.read')
        .entity('entities.campaigns.gen.plural').dispatchCallback()
      );
  }

  private readCampaigns(): Observable<ICampaign[]> {
    return this.dataService.readAll(this.baseUrl);
  }

}
