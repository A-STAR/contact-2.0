import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import {
  IDashboardParams,
  DashboardChartType,
} from './dashboard.interface';

import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  indicators$: Observable<IDashboardParams>;
  promiseAmount$: Observable<ChartData>;
  promiseCount$: Observable<ChartData>;
  promiseCountStatus$: Observable<ChartData>;
  promiseCover$: Observable<ChartData>;
  contactsDay: ChartData;
  contactsDayPlan: ChartData;

  promiseCountStatusOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Обещания за последние 30 дней',
      display: true
    },
    legend: {
      position: 'left',
      labels: {
        fontSize: 10
      }
    }
  };

  promiseCountOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Количество полученных обещаний за 30 дней',
      display: true
    },
    legend: {
      labels: {
        fontSize: 10
      }
    }
  };

  promiseAmountOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Сумма полученных обещаний за 30 дней',
      display: true
    },
    legend: {
      labels: {
        fontSize: 10
      }
    }
  };

  promiseCoverOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Покрытие обещаний за последние 30 дней',
      display: true
    },
    legend: {
      position: 'left',
      labels: {
        fontSize: 10
      }
    }
  };

  contactsDayPlanOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Количество контактов за текущий день с должником',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10
      }
    }
  };

  contactsDayOptions: ChartOptions = {
    title: {
      position: 'top',
      fontSize: 14,
      text: 'Успешные контакты за день',
      display: true
    },
    legend: {
      position: 'right',
      labels: {
        fontSize: 10
      }
    }
  };

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {

    this.indicators$ = this.dashboardService.getParams();

    this.promiseAmount$ = this.dashboardService.getPromiseAmount()
      .pipe(
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_AMOUNT, data))
      );

    this.promiseCount$ = this.dashboardService.getPromiseCount()
      .pipe(
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COUNT, data))
      );

    this.promiseCover$ = this.dashboardService.getPromiseCover()
      .pipe(
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COVER, data))
      );

    this.promiseCountStatus$ = this.dashboardService.getPromiseCountStatus()
      .pipe(
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COUNT_STATUS, data))
      );

    this.dashboardService.getContactsDay()
      .subscribe(data => {
        this.contactsDay = this.dashboardService.prepareChartData(DashboardChartType.CONTACT_DAY, data);
        this.contactsDayPlan = this.dashboardService.prepareChartData(DashboardChartType.CONTACT_DAY_PLAN, data);
      });

  }
}
