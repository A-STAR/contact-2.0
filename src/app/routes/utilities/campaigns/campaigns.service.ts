import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../core/data/data.service';
import { IAppState } from '../../../core/state/state.interface';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ICampaign,
         ICampaignsState,
         ICampaignSelectPayload,
         IParticipantViewEntity,
         IParticipantSelectPayload } from './campaigns.interface';

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
      .select(state => state.campaings)
      .distinctUntilChanged();
  }

  get campaigns(): Observable<ICampaign[]> {
    return this.store
      .select(state => state.campaings.campaigns)
      .distinctUntilChanged();
  }

  get selectedCampaign(): Observable<ICampaign> {
    return this.store
    .select(state => state.campaings.selectedCampaign);
  }

  get selectedParticipant(): Observable<IParticipantViewEntity> {
    return this.store
    .select(state => state.campaings.selectedParticipant);
  }
  // too much repetative code, how an entity can be parameterized?
  selectCampaign(selectedCampaign: ICampaign, campaigns?: ICampaign[]): ICampaignSelectPayload {
    const onCampaignSelectPayload: ICampaignSelectPayload = {
      selectedCampaign
    };
    if (campaigns) {
      onCampaignSelectPayload.campaigns = campaigns;
    }
    this.store.dispatch({
      type: CampaignsService.CAMPAIGN_SELECT,
      payload: onCampaignSelectPayload
    });
    return onCampaignSelectPayload;
  }

  selectParticipant(selectedParticipant: IParticipantViewEntity,
    participants?: IParticipantViewEntity[]): IParticipantSelectPayload {

    const onParticipantSelectPayload: IParticipantSelectPayload = {
      selectedParticipant
    };
    if (participants) {
      onParticipantSelectPayload.participants = participants;
    }
    this.store.dispatch({
      type: CampaignsService.PARTICIPANT_SELECT,
      payload: onParticipantSelectPayload
    });
    return onParticipantSelectPayload;
  }

  /**
   * Experimental
   * @param {T} entity Entity to select
   * @param {T[]} entities Entities collecton
   * @param {string} selectAction Select action type
   * @return {U} payload Action's payload
   */
  // selectEntity<T, U>(selectAction: string, entity: T, entities?: T[]): U {
  //   const payload: U = {

  //   }
  // }


  private readCampaigns(): Observable<ICampaign[]> {
    // return this.dataService.readAll(this.baseUrl);
    return Observable.of([
      {
        id: 1,
        name: 'Захват мира',
        groupName: 'Моя группа',
        statusCode: 1,
        typeCode: 1,
        startDateTime: '27.10.2015',
        finishDateTime: '28.10.2015',
        comment: 'Мой комментарий',
        timeZoneUsed: true
      },
      {
        id: 2,
        name: 'Просто кампания',
        groupName: 'Моя группа',
        statusCode: 1,
        typeCode: 1,
        startDateTime: '27.10.2015',
        finishDateTime: '28.10.2015',
        comment: 'Мой комментарий2',
        timeZoneUsed: false
      }
    ]);
  }

}
