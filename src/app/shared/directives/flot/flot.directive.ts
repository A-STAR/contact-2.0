import { Directive, ElementRef, Input, NgZone, OnInit, OnChanges, OnDestroy, SimpleChange } from '@angular/core';

@Directive({
  selector: '[appFlot]'
})
export class FlotDirective implements OnInit, OnChanges, OnDestroy {
  @Input() dataset: any;
  @Input() options: any;
  @Input() width = '100%';
  @Input() height = '220px';
  @Input() series: any;

  private plot: any;

  constructor(
    private element: ElementRef,
    private zone: NgZone,
  ) {
    if (!$.plot) {
      throw new Error('jQuery flot plugin not available.');
    }
  }

  ngOnInit(): void {
    this.init();
    this.onDatasetChanged(this.dataset);
    this.onSeriesToggled(this.series);
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (!$.plot) {
      return;
    }
    if (changes.dataset) {
      this.onDatasetChanged(changes.dataset.currentValue);
    }
    if (changes.series) {
      this.onSeriesToggled(changes.series.currentValue);
    }
  }

  init(): void {
    const element = this.element.nativeElement;

    $(element).css({
      width: this.width,
      height: this.height
    });

    // Flot has to be initialized outside zone,
    // otherwise the zone gets unstable
    this.zone.runOutsideAngular(() => {
      this.plot = $.plot(element, [], this.options);
    });
  }

  onDatasetChanged(dataset: any): void {
    if (!this.plot || !this.dataset) {
      return;
    }

    this.plot.setData(dataset);
    this.plot.setupGrid();
    this.plot.draw();
  }

  onSeriesToggled(series: any): void {
    if (!this.plot || !series) {
      return;
    }

    const data = this.plot.getData();

    const toggleFor = (sName: string) => {
      return function(s: any, i: any): void {
        if (data[i] && data[i][sName]) {
          data[i][sName].show = s;
        }
      };
    };

    for (const sName in series) {
      if (series.hasOwnProperty(sName)) {
        series[sName].forEach(toggleFor(sName));
      }
    }

    this.plot.setData(data);
    this.plot.draw();
  }

  ngOnDestroy(): void {
    if (this.plot) {
      this.plot.shutdown();
    }
  }
}
