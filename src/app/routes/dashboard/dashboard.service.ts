import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartData, ChartOptions } from 'chart.js';

import {
  DashboardChartType,
  IDashboardParams,
  IDashboardPromiseAmount,
  IDashboardPromiseCount,
  IDashboardPromiseCountStatus,
  IDashboardPromiseCoverage,
  IDashboardContactsDay,
} from '@app/routes/dashboard/dashboard.interface';
import { IIndicator } from '@app/shared/components/charts/charts.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { makeKey } from '@app/core/utils';

const label = makeKey('dashboard.charts');

@Injectable()
export class DashboardService {

  private baseUrl = '/dashboard';

  private static readonly PRIMARY_COLOR = '#4a445f';
  private static readonly PRIMARY_COLOR_LIGHT = '#4a445fa1';
  private static readonly GREEN_COLOR = '#80da00';

  promiseCountStatusOptions: ChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseCountOptions: ChartOptions = {
    legend: {
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseAmountOptions: ChartOptions = {
    legend: {
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseCoverOptions: ChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  contactsDayPlanOptions: ChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  contactsDayOptions: ChartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 11,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) { }

  getParams(): Observable<IDashboardParams> {
    return this.dataService.read(`${this.baseUrl}/params`)
      .catch(this.notificationsService.fetchError('dashboard.errors.params').dispatchCallback());
  }

  getPromiseAmount(): Observable<IDashboardPromiseAmount> {
    return this.dataService.read(`${this.baseUrl}/promiseAmount`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseAmount').dispatchCallback());
  }

  getPromiseCount(): Observable<IDashboardPromiseCount> {
    return this.dataService.read(`${this.baseUrl}/promiseCount`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCount').dispatchCallback());
  }

  getPromiseCountStatus(): Observable<IDashboardPromiseCountStatus> {
    return this.dataService.read(`${this.baseUrl}/promiseCountStatus`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCountStatus').dispatchCallback());
  }

  getPromiseCover(): Observable<IDashboardPromiseCoverage> {
    return this.dataService.read(`${this.baseUrl}/promiseCover`)
      .catch(this.notificationsService.fetchError('dashboard.errors.promiseCover').dispatchCallback());
  }

  getContactsDay(): Observable<IDashboardContactsDay> {
    return this.dataService.read(`${this.baseUrl}/contactDay`)
      .catch(this.notificationsService.fetchError('dashboard.errors.contactDay').dispatchCallback());
  }

  prepareChartData(type: DashboardChartType, data: any): ChartData {
    switch (type) {
      case DashboardChartType.PROMISE_AMOUNT:
        return this.preparePromiseAmountChart(
          data as IDashboardPromiseAmount,
        );
      case DashboardChartType.PROMISE_COUNT:
        return this.preparePromiseCountChart(
          data as IDashboardPromiseCount,
        );
      case DashboardChartType.PROMISE_COUNT_STATUS:
        return this.preparePromiseCountStatusChart(
          data as IDashboardPromiseCountStatus,
        );
      case DashboardChartType.PROMISE_COVER:
        return this.preparePromiseCoverChart(
          data as IDashboardPromiseCoverage,
        );
      case DashboardChartType.CONTACT_DAY:
        return this.prepareContactsDayChart(
          data as IDashboardContactsDay,
        );
      case DashboardChartType.CONTACT_DAY_PLAN:
        return this.prepareContactsDayPlanChart(
          data as IDashboardContactsDay,
        );
      default:
        return data;
    }
  }

  prepareIndicators(data: IDashboardParams): (currencyName: string) => IIndicator[] {
    const currencyIndicators = ['monthPaymentAmount', 'monthPaymentCommission'];
    return (currencyName: string) =>
      Object.keys(data)
        .map((key: keyof IDashboardParams) => ({
          text: currencyIndicators.includes(key) ? `${data[key]} ${currencyName}` : `${data[key]}`,
          label: label(`indicators.${key}`),
          color: DashboardService.PRIMARY_COLOR_LIGHT
        }));
  }

  private preparePromiseCountStatusChart(data: IDashboardPromiseCountStatus): ChartData {
    return {
      labels: [
        `promiseCountStatus.legend.fullfilled`,
        `promiseCountStatus.legend.overdue`,
        `promiseCountStatus.legend.waiting`,
      ],
      datasets: [
        {
          data: [data.monthPromiseFulfilled || 1, data.monthPromiseOverdue || 1, data.monthPromiseWaiting || 1],
          backgroundColor: [DashboardService.GREEN_COLOR, '#ff8500', DashboardService.PRIMARY_COLOR_LIGHT],
        }
      ]
    };
  }

  private preparePromiseCountChart(data: IDashboardPromiseCount): ChartData {
    return {
      labels: data.promiseDateList,
      datasets: [
        {
          data: data.promiseCountList,
          label: 'promiseCount.legend.promiseCount',
          backgroundColor: DashboardService.PRIMARY_COLOR_LIGHT
        }
      ]
    };
  }

  private preparePromiseAmountChart(data: IDashboardPromiseAmount): ChartData {
    return {
      labels: data.promiseDateList,
      datasets: [
        {
          data: data.promiseAmountList,
          label: 'promiseAmount.legend.promiseAmount',
          backgroundColor: DashboardService.PRIMARY_COLOR
        }
      ]
    };
  }

  private preparePromiseCoverChart(data: IDashboardPromiseCoverage): ChartData {
    return {
      labels: [
        `promiseCover.legend.covered`,
        `promiseCover.legend.remaining`,
      ],
      datasets: [
        {
          data: [data.monthPromiseAmountCover, data.monthPromiseAmountRest],
          backgroundColor: [DashboardService.GREEN_COLOR, DashboardService.PRIMARY_COLOR_LIGHT],
        }
      ]
    };
  }

  private prepareContactsDayPlanChart(data: IDashboardContactsDay): ChartData {
    return {
      labels: [
        `contactsDayPlan.legend.fullfilled`,
        `contactsDayPlan.legend.remaining`,
      ],
      datasets: [
        {
          data: [data.debtorSuccessContact, data.debtorSuccessContactPlan],
          backgroundColor: [DashboardService.GREEN_COLOR, DashboardService.PRIMARY_COLOR_LIGHT],
        }
      ]
    };
  }

  private prepareContactsDayChart(data: IDashboardContactsDay): ChartData {
    return {
      labels: [
        `contactsDay.legend.debtor`,
        `contactsDay.legend.guarantor`,
        `contactsDay.legend.pledgor`,
        `contactsDay.legend.thirdParty`,
      ],
      datasets: [
        {
          data: [
            data.debtorSuccessContact || 1,
            data.guarantorSuccessContact || 1,
            data.pledgorSuccessContact || 1,
            data.thirdPersonSuccessContact || 1
          ],
          backgroundColor: ['#6584d4', '#00bff6', '#ffcc00', '#d071e5'],
        }
      ]
    };
  }

}
