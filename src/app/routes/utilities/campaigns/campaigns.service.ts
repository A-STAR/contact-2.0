import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data/data.service';
import { IAppState } from '../../../core/state/state.interface';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ICampaign,
         ICampaignsState,
         ICampaignSelectPayload,
         IParticipantSelectPayload,
         IParticipant} from './campaigns.interface';

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

  get state(): Observable<ICampaignsState> {
    return this.store
      .select(state => state.campaigns)
      .distinctUntilChanged();
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.store
    .select(state => state.campaigns.selectedCampaign);
  }

  get selectedParticipant(): Observable<IParticipant> {
    return this.store
    .select(state => state.campaigns.selectedParticipant);
  }

  selectCampaign(selectedCampaign: ICampaign): ICampaignSelectPayload {
    this.store.dispatch({
      type: CampaignsService.CAMPAIGN_SELECT,
      payload: { selectedCampaign }
    });
    return { selectedCampaign };
  }

  selectParticipant(selectedParticipant: IParticipant): IParticipantSelectPayload {
    this.store.dispatch({
      type: CampaignsService.PARTICIPANT_SELECT,
      payload: { selectedParticipant }
    });
    return { selectedParticipant };
  }

  private readCampaigns(): Observable<ICampaign[]> {
    return this.dataService.readAll(this.baseUrl);
  }

}
