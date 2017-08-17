import { Directive, Input, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAlignment]'
})
export class AlignmentDirective implements AfterViewInit {
  @Input() alignTarget: Element;
  @Input() autoAlign: boolean;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.autoAlign) {
      this.updateElementStyles();
    }
  }

  private updateElementStyles(): void {
    // TODO(a.tymchuk): 12 height?
    const height: number = this.getElementHeight(this.element.nativeElement) + 12;
    this.renderer.setStyle(this.element.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.element.nativeElement, 'top', `-${height - 2}px`);
  }

  private getElementHeight(element: Element): number {
    // jQuery
    return $(element).height();
  }
}
