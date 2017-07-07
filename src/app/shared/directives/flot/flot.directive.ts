import { OnChanges, OnDestroy, Directive, ElementRef, Input, Output, OnInit, SimpleChange, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[flot]'
})
export class FlotDirective implements OnInit, OnChanges, OnDestroy {

    element: any;
    plot: any;
    width: any;

    @Input() dataset: any;
    @Input() options: any;
    @Input() attrWidth: any;
    @Input() height: number;
    @Input() series: any;

    @Output() ready = new EventEmitter();

    constructor(private el: ElementRef) {
        this.element = $(this.el.nativeElement);

        if (!$.plot) {
            console.log('Flot chart no available.');
        }

        this.plot = null;
    }

    ngOnInit(): void {
      this.init();
      this.onDatasetChanged(this.dataset);
      this.onSerieToggled(this.series);
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
        if (!$.plot) {
            return;
        }
        // if (changes['dataset']) {
        //     this.onDatasetChanged(this.dataset);
        // }
        // if (changes['series']) {
        //     this.onSerieToggled(this.series);
        // }
    }

    init(): void {

        const heightDefault = 220;

        this.width = this.attrWidth || '100%';
        this.height = this.height || heightDefault;

        this.element.css({
            width: this.width,
            height: this.height
        });

        let plotObj;
        if (!this.dataset || !this.options) {
            return;
        }
        plotObj = $.plot(this.el.nativeElement, this.dataset, this.options);
        if (this.ready) {
            this.ready.next({ plot: plotObj });
        }
        return plotObj;
    }

    onDatasetChanged(dataset: any): void {
        if (this.plot) {
            this.plot.setData(dataset);
            this.plot.setupGrid();
            return this.plot.draw();
        } else {
            this.plot = this.init();
            this.onSerieToggled(this.series);
            return this.plot;
        }
    }

    onSerieToggled(series: any): void {
        if (!this.plot || !series) {
            return;
        }
        const someData = this.plot.getData();
        for (const sName in series) {
          if (series.hasOwnProperty(sName)) {
            series[sName].forEach(toggleFor(sName));
          }
        }

        this.plot.setData(someData);
        this.plot.draw();

        function toggleFor(sName: string): Function {
            return function(s: any, i: any): void {
                if (someData[i] && someData[i][sName]) {
                    someData[i][sName].show = s;
                }
            };
        }
    }

    ngOnDestroy(): void {
        if (this.plot) {
            this.plot.shutdown();
        }
    }
}
