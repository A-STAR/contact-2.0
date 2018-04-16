import { Directive, HostListener, Inject, Injector, Input } from '@angular/core';

import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';

import { DYNAMIC_MODULES } from '@app/core/dynamic-loader/dynamic-loader.service';
import { PopupOutletService } from '@app/core/dynamic-loader/popup-outlet.service';

@Directive({
  selector: '[appPopupOutlet]'
})
export class PopupOutletDirective {
  @Input() appPopupOutlet: string;

  constructor(
    @Inject(DYNAMIC_MODULES) private modules: IDynamicModule[][],
    private injector: Injector,
    private popupOutletService: PopupOutletService,
  ) {}

  @HostListener('click')
  onClick(): void {
    this.popupOutletService.open(this.modules, this.appPopupOutlet, this.injector);
  }
}
