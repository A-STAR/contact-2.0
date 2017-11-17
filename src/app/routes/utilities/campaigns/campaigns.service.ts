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
         IParticipant,
         ICampaignsStatistic, IUserStatistic } from './campaigns.interface';

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

  mockNumder = 0;

  fetchCampaignStat(campainId: number): Observable<ICampaignsStatistic> {
    const userStatistic = [{
          userFullName: 'Операторов Оператор Операторович',
          successProcessing: 1,
          unsuccessProcessing: 1,
          contact: 4,
          SMS: 6426246426426,
          successContact: 1,
          refusal: 1,
          promise: 2,
          promiseAmount: 564654
      }, {
          userFullName: 'Операторов Оператор Операторович',
          successProcessing: 1,
          unsuccessProcessing: 1,
          contact: 4,
          SMS: 6426246426426,
          successContact: 1,
          refusal: 1,
          promise: 2,
          promiseAmount: 564654
      }] as IUserStatistic[];

    // const ind = this.mockNumder++ % 2;
    return Observable.of({
      userStatistic,
      agridatedData: {
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

    // return this.dataService.read(this.baseUrl)
    //   .catch(() => Observable.of(data) as Observable<ICampaignsStatistic[]>)
    //   .catch(
    //     this.notificationsService.error('errors.default.read')
    //       .entity('entities.campaigns.gen.signal').dispatchCallback()
    //     );
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
    // TODO unmock when api will be ready
    // return (this.dataService.readAll(this.baseUrl)
    //   .catch(() =>
    return  Observable.of([{
        id: 1,
        name: 'Иванов Иван Иванович',
        groupName: 'Some group name',
        statusCode: 1,
        typeCode: 1,
        startDateTime: (new Date()).toString(),
        finishDateTime: (new Date()).toString(),
        comment: 'bla bla bla',
        timeZoneUsed: true
      }, {
        id: 1,
        name: 'Иванов Иван Иванович',
        groupName: 'Some group name',
        statusCode: 2,
        typeCode: 2,
        startDateTime: new Date(),
        finishDateTime: new Date(),
        comment: 'bla bla bla',
        timeZoneUsed: false
      }]) as Observable<ICampaign[]>;
  }
}

