import { OnInit, OnDestroy, Directive, Input, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[sparkline]'
})
export class SparklineDirective implements OnInit, OnDestroy {

  @Input() sparkline;

  // generate a unique resize event so we can detach later
  private resizeEventId = 'resize.sparkline' + 1324;
  private $element;

  constructor(private el: ElementRef) {
    this.$element = $(el.nativeElement);
  }

  ngOnInit(): void {
    this.initSparkLine();
  }

  initSparkLine(): void {
    let options = this.sparkline;
    const data = this.$element.data();

    if (!options) {// if no scope options, try with data attributes
      options = data;
    } else {
      if (data) {// data attributes overrides scope options
        options = $.extend({}, options, data);
      }
    }

    options.type = options.type || 'bar'; // default chart is bar
    options.disableHiddenCheck = true;

    this.$element.sparkline('html', options);

    if (options.resize) {
      $(window).on(this.resizeEventId, () => {
        this.$element.sparkline('html', options);
      });
    }
  }

  ngOnDestroy(): void {
    $(window).off(this.resizeEventId);
  }
}
