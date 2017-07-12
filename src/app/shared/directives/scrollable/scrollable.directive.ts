import { OnInit, Directive, Input, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: 'scrollable'
})
export class ScrollableDirective implements OnInit {

  @Input() height: number;
  defaultHeight = 250;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    $(this.element.nativeElement).slimScroll({
      height: (this.height || this.defaultHeight)
    });
  }

}
