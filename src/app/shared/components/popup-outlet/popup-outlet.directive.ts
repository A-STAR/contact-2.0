import { Directive, HostListener, Input } from '@angular/core';

import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

@Directive({
  selector: '[appPopupOutlet]'
})
export class PopupOutletDirective {
  @Input() appPopupOutlet: string | string[];

  constructor(
    private popupOutletService: PopupOutletService,
  ) {}

  @HostListener('click')
  onClick(): void {
    const params = Array.isArray(this.appPopupOutlet) ? this.appPopupOutlet : [ this.appPopupOutlet ];
    this.popupOutletService.open(params[0], params[1]);
  }
}
