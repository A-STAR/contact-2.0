import { Component, OnInit, Input} from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';

import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() data: ChartData;
  @Input() options: ChartOptions;

  chart: ChartComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
