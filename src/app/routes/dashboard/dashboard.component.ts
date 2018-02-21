import { ChangeDetectorRef, ChangeDetectionStrategy, Component,  OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, first } from 'rxjs/operators';

import { DashboardChartType } from './dashboard.interface';
import { IIndicator } from '@app/shared/components/charts/charts.interface';
import { ICurrency } from '@app/routes/utilities/currencies/currencies.interface';

import { DashboardService } from './dashboard.service';
import { LookupService } from '@app/core/lookup/lookup.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  indicators: IIndicator[];
  promiseAmount: ChartData;
  promiseCount: ChartData;
  promiseCountStatus: ChartData;
  promiseCover: ChartData;
  contactsDay: ChartData;
  contactsDayPlan: ChartData;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private lookupService: LookupService,
  ) { }

  ngOnInit(): void {

    combineLatest(
        this.dashboardService.getParams(),
        this.lookupService.lookup<ICurrency>('currencies')
      )
      .pipe(first())
      .map(([ params, currencies]) => {
        const prepareFn = this.dashboardService.prepareIndicators(params);
        const currentCurrency = currencies.find(currency => currency.code === '1');
        return currentCurrency && currentCurrency.shortName ? prepareFn(currentCurrency.shortName) : prepareFn('руб.');
      })
      .subscribe(indicators => {
        this.indicators = indicators;
        this.cdRef.markForCheck();
      });

    this.dashboardService.getPromiseAmount()
      .pipe(
        first(),
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_AMOUNT, data)),
      )
      .subscribe(promiseAmount => {
        this.promiseAmount = promiseAmount;
        this.cdRef.markForCheck();
      });

    this.dashboardService.getPromiseCount()
      .pipe(
        first(),
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COUNT, data)),
      )
      .subscribe(promiseCount => {
        this.promiseCount = promiseCount;
        this.cdRef.markForCheck();
      });

    this.dashboardService.getPromiseCover()
      .pipe(
        first(),
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COVER, data)),
      )
      .subscribe(promiseCover => {
        this.promiseCover = promiseCover;
        this.cdRef.markForCheck();
      });

    this.dashboardService.getPromiseCountStatus()
      .pipe(
        first(),
        map(data => this.dashboardService.prepareChartData(DashboardChartType.PROMISE_COUNT_STATUS, data)),
      )
      .subscribe(promiseCountStatus => {
        this.promiseCountStatus = promiseCountStatus;
        this.cdRef.markForCheck();
      });

    this.dashboardService.getContactsDay()
      .pipe(first())
      .subscribe(data => {
        this.contactsDay = this.dashboardService.prepareChartData(DashboardChartType.CONTACT_DAY, data);
        this.contactsDayPlan = this.dashboardService.prepareChartData(DashboardChartType.CONTACT_DAY_PLAN, data);
        this.cdRef.markForCheck();
      });

  }

  get contactsDayOptions(): ChartOptions {
    return this.dashboardService.contactsDayOptions;
  }

  get contactsDayPlanOptions(): ChartOptions {
    return this.dashboardService.contactsDayPlanOptions;
  }

  get promiseCoverOptions(): ChartOptions {
    return this.dashboardService.promiseCoverOptions;
  }

  get promiseAmountOptions(): ChartOptions {
    return this.dashboardService.promiseAmountOptions;
  }

  get promiseCountOptions(): ChartOptions {
    return this.dashboardService.promiseCountOptions;
  }

  get promiseCountStatusOptions(): ChartOptions {
    return this.dashboardService.promiseCountStatusOptions;
  }

}
