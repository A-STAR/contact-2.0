import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
})
export class PopupOutletModule {}
