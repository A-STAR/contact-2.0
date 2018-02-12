import { ChangeDetectorRef, ChangeDetectionStrategy, Component,  OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { DashboardChartType } from './dashboard.interface';
import { IIndicator } from '@app/shared/components/charts/charts.interface';
import { ICurrency } from '@app/shared/gui-objects/widgets/currencies/currencies.interface';

import { DashboardService } from './dashboard.service';
import { LookupService } from '@app/core/lookup/lookup.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  indicators$: Observable<IIndicator[]>;
  promiseAmount$: Observable<ChartData>;
  promiseCount$: Observable<ChartData>;
  promiseCountStatus$: Observable<ChartData>;
  promiseCover$: Observable<ChartData>;
  contactsDay: ChartData;
  contactsDayPlan: ChartData;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private lookupService: LookupService,
  ) { }

  ngOnInit(): void {

    this.indicators$ = combineLatest(
        this.dashboardService.getParams(),
        this.lookupService.lookup<ICurrency>('currencies')
      )
      .map(([ params, currencies]) => {
        const prepareFn = this.dashboardService.prepareIndicators(params);
        const currentCurrency = currencies.find(currency => currency.code === '1');
        return currentCurrency && currentCurrency.shortName ? prepareFn(currentCurrency.shortName) : prepareFn('руб.');
      });

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
