import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartData } from 'chart.js';

import {
  DashboardChartType,
  IDashboardParams,
  IDashboardPromiseAmount,
  IDashboardPromiseCount,
  IDashboardPromiseCountStatus,
  IDashboardPromiseCoverage,
  IDashboardContactsDay,
} from '@app/routes/dashboard/dashboard.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DashboardService {

  private baseUrl = '/dashboard';

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
        return this.prepareContactDayChart(
          data as IDashboardContactsDay,
        );
      case DashboardChartType.CONTACT_DAY_PLAN:
        return this.prepareContactDayPlanChart(
          data as IDashboardContactsDay,
        );
      default:
        return data;
    }
  }

  private preparePromiseCountStatusChart(data: IDashboardPromiseCountStatus): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: [ 'monthPromiseFulfilled', 'monthPromiseOverdue', 'monthPromiseWaiting' ],
      datasets: [
        {
          data: [data.monthPromiseFulfilled, data.monthPromiseOverdue, data.monthPromiseWaiting]
        }
      ]
    };
  }

  private preparePromiseCountChart(data: IDashboardPromiseCount): ChartData {
    return {
      labels: data.promiseDateList,
      datasets: [
        {
          data: data.promiseCountList
        }
      ]
    };
  }

  private preparePromiseAmountChart(data: IDashboardPromiseAmount): ChartData {
    return {
      labels: data.promiseDateList,
      datasets: [
        {
          data: data.promiseAmountList
        }
      ]
    };
  }

  private preparePromiseCoverChart(data: IDashboardPromiseCoverage): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['Covered', 'Remaining'],
      datasets: [
        {
          data: [data.monthPromiseAmountCover, data.monthPromiseAmountRest]
        }
      ]
    };
  }

  private prepareContactDayPlanChart(data: IDashboardContactsDay): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['Fullfilled', 'Remaining'],
      datasets: [
        {
          data: [data.debtorSuccessContact, data.debtorSuccessContactPlan]
        }
      ]
    };
  }

  private prepareContactDayChart(data: IDashboardContactsDay): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['debtorSuccessContact', 'guarantorSuccessContact', 'pledgorSuccessContact', 'thirdPersonSuccessContact'],
      datasets: [
        {
          data: [
            data.debtorSuccessContact,
            data.guarantorSuccessContact,
            data.pledgorSuccessContact,
            data.thirdPersonSuccessContact
          ]
        }
      ]
    };
  }

}
