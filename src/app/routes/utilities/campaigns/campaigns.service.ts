import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import {
  ICampaign,
  ICampaignGroup,
  ICampaignsState,
  ICampaignSelectPayload,
  IParticipantSelectPayload,
  IParticipant,
  ICampaignsStatistic, IUserStatistic
} from './campaigns.interface';
import { IEntityTranslation } from '../../../core/entity/translations/entity-translations.interface';

import { DataService } from '../../../core/data/data.service';
import { EntityTranslationsService } from '../../../core/entity/translations/entity-translations.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

export const CAMPAIGN_NAME_ID = new InjectionToken<number>('CAMPAIGN_NAME_ID');

@Injectable()
export class CampaignsService {
  static CAMPAIGN_SELECT = 'CAMPAIGN_SELECT';
  static PARTICIPANT_SELECT = 'PARTICIPANT_SELECT';
  public baseUrl = '/campaigns';

  constructor(private store: Store<IAppState>,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private entityTranslationService: EntityTranslationsService,
    @Inject(CAMPAIGN_NAME_ID) private campaignNameId: number
  ) { }

  fetchCampaigns(): Observable<ICampaign[]> {
    return this.readCampaigns()
      .catch(
      this.notificationsService.fetchError()
        .entity('entities.campaign.gen.plural').dispatchCallback()
      );
  }

  /**
   * Uses mock response, since there is no api in backend yet
   * @param campaignId
   */
  fetchCampaignStat(campaignId: number): Observable<ICampaignsStatistic> {
    // return this.dataService.read(this.baseUrl)
    //   .catch(() => Observable.of(data) as Observable<ICampaignsStatistic[]>)
    //   .catch(
    //     this.notificationsService.error('errors.default.read')
    //       .entity('entities.campaigns.gen.signal').dispatchCallback()
    //     );
    const userStatistic = [{
          userFullName: 'Операторов Оператор Операторович',
          successProcessing: 1,
          unsuccessProcessing: 1,
          contact: 4,
          SMS: '74262464264',
          successContact: 1,
          refusal: 1,
          promise: 2,
          promiseAmount: 564654
      }, {
          userFullName: 'Операторов Оператор Операторович',
          successProcessing: 1,
          unsuccessProcessing: 1,
          contact: 4,
          SMS: '74262464265',
          successContact: 1,
          refusal: 1,
          promise: 2,
          promiseAmount: 564654
      }] as IUserStatistic[];

    return Observable.of({
      userStatistic,
      aggregatedData: {
        untreated: 10,
        successProcessingSum: 2,
        unsuccessProcessingSum: 5,
        contacSum: 7,
        SMSSum: 3,
        refusalSum: 100,
        promiseSum: 1000,
        promiseAmountSum: 1000000
      }
    });
  }

  get state(): Observable<ICampaignsState> {
    return this.store
      .select(state => state.campaigns);
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

  createCampaign(campaign: ICampaign): Observable<ICampaign[]> {
    return this.dataService.create(this.baseUrl, {}, campaign)
      .catch(this.notificationsService.createError()
        .entity('entities.campaign.gen.singular').dispatchCallback());
  }

  updateCampaign(campaign: ICampaign): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{campaignId}`, {
      campaignId: campaign.id
    }, campaign)
      .catch(this.notificationsService.updateError().entity('entities.campaign.gen.singular').callback());
  }

  removeCampaign(): Observable<any> {
    return this.selectedCampaign
      .take(1)
      .switchMap(selectedCampaign => this.deleteCampaign(selectedCampaign.id))
      .catch(this.notificationsService.deleteError().entity('entities.campaign.gen.singular').callback());
  }

  fetchCampaignGroups(): Observable<ICampaignGroup[]> {
    return this.dataService.readAll(`/filters/groups?entityTypeIds={entityTypeIds}&isManual={isManual}`, {
        // todo: get from dict
        entityTypeIds: [19],
        // where should I get this?
        isManual: 0
      })
      .catch(
        this.notificationsService.fetchError()
          .entity('entities.groups.gen.plural').dispatchCallback()
        );
  }

  fetchParticipants(): Observable<IParticipant[]> {
    return this.selectedCampaign
      .take(1)
      .switchMap(selectedCampaign => selectedCampaign ? this.readParticipants(selectedCampaign.id) : Observable.of([]))
      .catch(
      this.notificationsService.fetchError()
        .entity('entities.participant.gen.plural').dispatchCallback()
      );
  }

  fetchNotAddedParticipants(): Observable<IParticipant[]> {
    return this.selectedCampaign
      .take(1)
      .switchMap(selectedCampaign => this.readNotAddedParticipants(selectedCampaign.id))
      .catch(
      this.notificationsService.fetchError()
        .entity('entities.participant.gen.plural').dispatchCallback()
      );
  }

  addParticipants(participantIds: number[]): Observable<any> {
    return this.selectedCampaign
      .take(1)
      .switchMap(selectedCampaign => this.createParticipants(selectedCampaign.id, participantIds))
      .catch(this.notificationsService.createError()
        .entity('entities.participant.gen.plural').dispatchCallback()
      );
  }

  removeParticipants(participantIds: number[]): Observable<any> {
    return this.selectedCampaign
      .take(1)
      .switchMap(selectedCampaign => this.deleteParticipants(selectedCampaign.id, participantIds))
      .catch(this.notificationsService.deleteError()
        .entity('entities.participant.gen.plural').dispatchCallback()
      );
  }

  readCampaignNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.entityTranslationService.readTranslations(entityId, this.campaignNameId);
  }

  private readParticipants(campaignId: number): Observable<IParticipant[]> {
    return this.dataService.readAll(`${this.baseUrl}/{campaignId}/users`, { campaignId });
  }

  private readNotAddedParticipants(campaignId: number): Observable<IParticipant[]> {
    return this.dataService.readAll(`${this.baseUrl}/{campaignId}/users/notadded`, { campaignId });
  }

  private readCampaigns(): Observable<ICampaign[]> {
    return this.dataService.readAll(this.baseUrl);
  }

  private deleteCampaign(campaignId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{campaignId}`, { campaignId });
  }

  private createParticipants(campaignId: number, participantIds: number[]): Observable<any> {
    return this.dataService.create(`${this.baseUrl}/{campaignId}/users`,
     { campaignId}, { usersIds: participantIds });
  }

  private deleteParticipants(campaignId: number, participantIds: number[]): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{campaignId}/users/?id={userIds}`,
     { campaignId, userIds: participantIds });
  }

}
