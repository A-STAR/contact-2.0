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
import { of } from 'rxjs/observable/of';

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
    // return this.dataService.read(`${this.baseUrl}/promiseAmount`)
    //   .catch(this.notificationsService.fetchError('dashboard.errors.promiseAmount').dispatchCallback());
    return of({
      promiseDateList: ['01.01.2018', '02.01.2018', '03.01.2018', '04.01.2018', '05.01.2018'],
      promiseAmountList: [145, 120, 99, 45, 101]
    });
  }

  getPromiseCount(): Observable<IDashboardPromiseCount> {
    // return this.dataService.read(`${this.baseUrl}/promiseCount`)
    //   .catch(this.notificationsService.fetchError('dashboard.errors.promiseCount').dispatchCallback());
    return of({
      promiseDateList: ['01.01.2018', '02.01.2018', '03.01.2018', '04.01.2018', '05.01.2018'],
      promiseCountList: [10, 25, 4, 33, 45]
    });
  }

  getPromiseCountStatus(): Observable<IDashboardPromiseCountStatus> {
    // return this.dataService.read(`${this.baseUrl}/promiseCountStatus`)
    //   .catch(this.notificationsService.fetchError('dashboard.errors.promiseCountStatus').dispatchCallback());
    return of({
      monthPromiseFulfilled: 13,
      monthPromiseOverdue: 15,
      monthPromiseWaiting: 4
    });
  }

  getPromiseCover(): Observable<IDashboardPromiseCoverage> {
    // return this.dataService.read(`${this.baseUrl}/promiseCover`)
    //   .catch(this.notificationsService.fetchError('dashboard.errors.promiseCover').dispatchCallback());
    return of({
      monthPromiseAmountCover: 33,
      monthPromiseAmountRest: 15,
    });
  }

  getContactsDay(): Observable<IDashboardContactsDay> {
    // return this.dataService.read(`${this.baseUrl}/contactDay`)
    //   .catch(this.notificationsService.fetchError('dashboard.errors.contactDay').dispatchCallback());
    return of({
      debtorSuccessContact: 101,
      guarantorSuccessContact: 13,
      pledgorSuccessContact: 27,
      thirdPersonSuccessContact: 61,
      debtorSuccessContactPlan: 34
    });
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
      labels: [ 'Выполнено', 'Просрочено', 'Ожидание' ],
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
          label: 'Кол-во обещаний',
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
          label: 'Сумма',
          backgroundColor: '#23b7e5'
        }
      ]
    };
  }

  private preparePromiseCoverChart(data: IDashboardPromiseCoverage): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['Покрыто', 'Осталось'],
      datasets: [
        {
          data: [data.monthPromiseAmountCover, data.monthPromiseAmountRest],
          backgroundColor: ['#37bc9b', '#131e26'],
        }
      ]
    };
  }

  private prepareContactDayPlanChart(data: IDashboardContactsDay): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['Выполнено', 'Осталось'],
      datasets: [
        {
          data: [data.debtorSuccessContact, data.debtorSuccessContactPlan],
          backgroundColor: ['#37bc9b', '#131e26'],
        }
      ]
    };
  }

  private prepareContactDayChart(data: IDashboardContactsDay): ChartData {
    return {
      // TODO(i.lobanov): translate
      labels: ['Должник', 'Поручитель', 'Залогодатель', 'Третье лицо'],
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
