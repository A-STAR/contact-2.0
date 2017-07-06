import { OnInit, OnDestroy, Directive, Input, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Directive({
    selector: '[appNow]'
})
export class NowDirective implements OnInit, OnDestroy {

    @Input() format;
    intervalId;

    constructor(private element: ElementRef) { }

    ngOnInit(): void {
        this.updateTime();
        this.intervalId = setInterval(this.updateTime.bind(this), 1000);
    }

    updateTime(): void {
        const dt = moment().format(this.format);
        this.element.nativeElement.innerHTML = dt;
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

}
