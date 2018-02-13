import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartData, ChartOptions } from 'chart.js';
import { of } from 'rxjs/observable/of';

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

  private indicatorColors = {
    debtActiveCnt: '#7266ba',
    debtNeedCallCnt: '#7266ba',
    monthPaymentCnt: '#37bc9b',
    monthPaymentAmount: '#37bc9b',
    monthPaymentCommission: '#37bc9b',
  };

  promiseCountStatusOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'promiseCountStatus.label',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseCountOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'promiseCount.label',
      display: true
    },
    legend: {
      labels: {
        fontSize: 10,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseAmountOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'promiseAmount.label',
      display: true
    },
    legend: {
      labels: {
        fontSize: 10,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  promiseCoverOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'promiseCover.label',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  contactsDayPlanOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'contactsDayPlan.label',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10,
        fontFamily: 'Roboto Condensed',
      }
    }
  };

  contactsDayOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      fontFamily: 'Roboto Condensed',
      text: 'contactsDay.label',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10,
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
          color: this.indicatorColors[key]
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
          data: [data.monthPromiseFulfilled, data.monthPromiseOverdue, data.monthPromiseWaiting],
          backgroundColor: ['#37bc9b', '#23b7e5', '#131e26'],
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
          backgroundColor: '#23b7e5'
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
          backgroundColor: '#23b7e5'
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
          backgroundColor: ['#37bc9b', '#131e26'],
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
          backgroundColor: ['#37bc9b', '#131e26'],
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
            data.debtorSuccessContact,
            data.guarantorSuccessContact,
            data.pledgorSuccessContact,
            data.thirdPersonSuccessContact
          ],
          backgroundColor: ['#37bc9b', '#23b7e5', '#131e26', '#7266ba'],
        }
      ]
    };
  }

}
