import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ChartOptions, Chart, ChartType, ChartData } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

import { compose } from 'ramda';
import * as moment from 'moment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild('canvas') canvasEl: ElementRef;

  @Input() data: ChartData;
  @Input() options: ChartOptions;
  @Input() type: ChartType;
  @Input() translationKey: string;

  ctx: CanvasRenderingContext2D;
  chart: Chart;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.ctx = this.canvasEl.nativeElement.getContext('2d');
    this.chart = new Chart(this.ctx, {
      // TODO(i.lobanov): in the future it can be translated on lang change
      data: this.translateData(this.data),
      type: this.type,
      options: {
        ...this.translateOptions(this.options),
        maintainAspectRatio: false,
        responsive: true,
      },
    });
  }

  private translateOptions(options: ChartOptions): ChartOptions {
    if (options.title && options.title.text) {
      options.title = {
        ...options.title,
        text: this.translate(options.title.text),
      };
    }
    return options;
  }

  private translateData(data: ChartData): ChartData {
    return compose(
      this.translateTooltips.bind(this),
      this.translateLegend.bind(this),
    )(data);
  }

  private translateLegend(data: ChartData): ChartData {
    return {
      ...data,
      labels: data.labels.map(
        label =>
          Array.isArray(label)
            ? label.map(subLabel => this.translate(subLabel))
            : this.translate(label),
      ),
    };
  }

  private translateTooltips(data: ChartData): ChartData {
    return {
      ...data,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        label: dataset.label ? this.translate(dataset.label) : dataset.label,
      })),
    };
  }

  private translate(path: string): string {
    return this.isDate(path)
      ? path
      : this.translateService.instant(`${this.translationKey || ''}.${path}`);
  }

  private isDate(path: string): boolean {
    return moment(path, 'YYYY-MM-DD').isValid();
  }
}
