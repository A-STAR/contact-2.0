import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ICampaignDebt, ICampaignProcessedDebt } from './campaign.interface';

import { DataService } from '@app/core/data/data.service';
import { DebtService } from '@app/routes/workplaces/shared/debt/debt.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

interface ICampaignRouteParams {
  campaignId: number;
}

@Injectable()
export class CampaignService {
  private _campaignDebt$ = new BehaviorSubject<ICampaignDebt>(null);

  constructor(
    private dataService: DataService,
    private debtService: DebtService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
  ) {}

  get isCampaignDebtActive$(): Observable<boolean> {
    return this._campaignDebt$.map(debt => this.debtService.isDebtActive(debt));
  }

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this._campaignDebt$;
  }

  get campaignId(): number {
    return Number(this.routeParams.campaignId);
  }

  get routeParams(): ICampaignRouteParams {
    return (this.route.params as BehaviorSubject<ICampaignRouteParams>).value;
  }

  preloadCampaignDebt(): void {
    this.fetchDebtId(this.campaignId)
      .flatMap(debtId => this.fetchCampaignDebt(this.campaignId, debtId))
      .subscribe(campaignDebt => this._campaignDebt$.next(campaignDebt));
  }

  changeStatusToProblematic(data: any): any {
    const { debtId, personId } = this._campaignDebt$.value;
    return this.debtService.changeStatus(personId, debtId, { ...data, statusCode: 9 }, true);
  }

  fetchProcessedDebtsForCurrentCampaign(): Observable<ICampaignProcessedDebt[]> {
    const { campaignId } = this;
    return this.dataService.readAll('/campaigns/{campaignId}/debts/processed', { campaignId })
      .catch(this.notificationsService.fetchError().entity('entities.debts.gen.plural').dispatchCallback());
  }

  markCurrentDebtAsFinished(): Observable<null> {
    const { campaignId } = this;
    const { debtId } = this._campaignDebt$.value;
    return this.dataService.update('/campaigns/{campaignId}/debts/{debtId}', { campaignId, debtId }, {})
      .catch(this.notificationsService.updateError().entity('entities.debts.gen.singular').dispatchCallback());
  }

  private fetchDebtId(campaignId: number): Observable<number> {
    return this.dataService.read('/campaigns/{campaignId}/debts', { campaignId })
      .catch(this.notificationsService.fetchError().entity('entities.debt.gen.singular').dispatchCallback());
  }

  private fetchCampaignDebt(campaignId: number, debtId: number): Observable<ICampaignDebt> {
    return this.dataService.read('/campaigns/{campaignId}/debts/{debtId}', { campaignId, debtId })
      .catch(this.notificationsService.fetchError().entity('entities.debt.gen.singular').dispatchCallback());
  }
}
