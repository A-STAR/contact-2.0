import { OnInit, OnDestroy, Directive, Input, ElementRef, NgZone } from '@angular/core';
import * as moment from 'moment';

@Directive({
  selector: '[appNow]'
})
export class NowDirective implements OnInit, OnDestroy {
  @Input() format;

  intervalId;

  constructor(
    private element: ElementRef,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 1000);
    });
  }

  updateTime(): void {
    const dt = moment().format(this.format);
    this.element.nativeElement.innerHTML = dt;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
