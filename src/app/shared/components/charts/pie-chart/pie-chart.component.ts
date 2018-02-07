import { Component, OnInit, Input } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';

import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() data: ChartData;
  @Input() options: ChartOptions;

  chart: ChartComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
