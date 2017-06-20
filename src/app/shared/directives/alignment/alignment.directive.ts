import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[alignment]'
})
export class AlignmentDirective implements OnChanges {

  @Input() alignTarget: Element;
  @Input() autoAlignEnabled: boolean;

  constructor(private element: ElementRef,
              private renderer2: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('alignTarget' in changes && this.alignTarget && this.autoAlignEnabled) {
      this.updateElementStyles();
    }
  }

  private updateElementStyles(): void {
    const height: number = this.getElementHeight(this.element.nativeElement) + 12; // TODO(a.poterenko): 12 height?
    this.renderer2.setStyle(this.element.nativeElement, 'position', 'absolute');
    this.renderer2.setStyle(this.element.nativeElement, 'top', `-${height}px`);
  }

  private getElementHeight(element: Element): number {
    // jQuery
    return $(element).height();
  }
}