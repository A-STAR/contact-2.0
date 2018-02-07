import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ChartOptions, Chart, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @ViewChild('canvas') canvasEl: ElementRef;
  @Input() data: ChartData;
  @Input() options: ChartOptions;
  @Input() type: ChartType;

  ctx: CanvasRenderingContext2D;
  chart: Chart;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.canvasEl.nativeElement.getContext('2d');
    this.chart = new Chart(this.ctx, {
      data: this.data,
      type: this.type,
      options: {
          ...this.options,
          maintainAspectRatio: true,
          responsive: true
      }
    });
  }

}
