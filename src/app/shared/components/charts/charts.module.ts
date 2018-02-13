import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartComponent } from './chart/chart.component';
import { IndicatorsComponent } from './indicators/indicators.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    BarChartComponent,
    IndicatorsComponent,
    PieChartComponent,
    ProgressChartComponent,
    ChartComponent,
  ],
  exports: [
    BarChartComponent, IndicatorsComponent,
    PieChartComponent,
    ProgressChartComponent,
    ChartComponent,
  ],
})
export class ChartsModule {}
