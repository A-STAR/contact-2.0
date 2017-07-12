import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[sparkline]'
})
export class SparklineDirective implements OnInit, OnDestroy {

  @Input() sparkline;

  private $element;
  private resizeListener: () => void;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {
    this.$element = $(element.nativeElement);
  }

  ngOnInit(): void {
    this.initSparkLine();
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private initSparkLine(): void {
    let options = this.sparkline;
    const data = this.$element.data();

    if (!options) {
      // If no scope options, try with data attributes
      options = data;
    } else if (data) {
      // Data attributes overrides scope options
      options = $.extend({}, options, data);
    }

    options.type = options.type || 'bar';
    options.disableHiddenCheck = true;

    this.render(options);

    if (options.resize) {
      this.resizeListener = this.renderer.listen(document, 'resize', () => this.render(options));
    }
  }

  private render(options: object): void {
    this.$element.sparkline('html', options);
  }
}
