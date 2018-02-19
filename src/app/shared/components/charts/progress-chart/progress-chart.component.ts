import { Component, OnInit, Input } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';

import { ChartComponent } from '@app/shared/components/charts/chart/chart.component';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit {

  @Input() data: ChartData;
  @Input() options: ChartOptions;
  @Input() translationKey: string;

  chart: ChartComponent;

  constructor() { }

  ngOnInit(): void {
    this.options = {
      ...this.options,
      // TODO:(i.lobanov): Why we use these options? By default is used 2 * PI (full circle)
      // rotation: 1 * Math.PI,
      // circumference: 1 * Math.PI
    };
  }

}
