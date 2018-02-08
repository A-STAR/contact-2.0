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

  chart: ChartComponent;

  constructor() { }

  ngOnInit(): void {
    this.options = {
      ...this.options,
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI
    };
  }

}
