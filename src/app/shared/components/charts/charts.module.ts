import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartComponent } from './chart/chart.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BarChartComponent, IndicatorComponent, PieChartComponent, ProgressChartComponent, ChartComponent ],
  exports: [ BarChartComponent, IndicatorComponent, PieChartComponent, ProgressChartComponent, ChartComponent ]
})
export class ChartsModule { }
