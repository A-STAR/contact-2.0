import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PopupOutletService } from './popup-outlet.service';

import { PopupOutletComponent } from './popup-outlet.component';
import { PopupOutletDirective } from './popup-outlet.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PopupOutletComponent,
    PopupOutletDirective,
  ],
  declarations: [
    PopupOutletComponent,
    PopupOutletDirective,
  ],
  providers: [
    PopupOutletService,
  ],
})
export class PopupOutletModule {}
