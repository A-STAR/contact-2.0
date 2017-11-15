import { OnInit, OnChanges, Directive, Input, SimpleChange, ElementRef } from '@angular/core';

declare var EasyPieChart: any;

@Directive({
  // tslint:disable-next-line
  selector: '[easypiechart]'
})
export class EasypiechartDirective implements OnInit, OnChanges {

  private defaultOptions = {
    barColor: '#ef1e25',
    trackColor: '#f9f9f9',
    scaleColor: '#dfe0e0',
    scaleLength: 5,
    lineCap: 'round',
    lineWidth: 3,
    size: 110,
    rotate: 0,
    animate: {
      duration: 1000,
      enabled: true
    }
  };

  private pieChart: any;
  @Input() percent;
  @Input() options;

  constructor(private element: ElementRef) {
    this.percent = this.percent || 0;
    this.options = Object.assign({}, this.defaultOptions, this.options);
  }

  ngOnInit(): void {
    if (EasyPieChart) {
      this.pieChart = new EasyPieChart(this.element.nativeElement, this.options);
      this.pieChart.update(this.percent);
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (this.pieChart && changes['percent']) {
      this.pieChart.update(this.percent);
    }
  }

}
