import {
  Directive,
  ElementRef,
  Inject,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements AfterViewInit {

  constructor(@Inject(ElementRef) private element: ElementRef) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.element.nativeElement.focus(), 50);
  }
}
