import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupService } from './popup.service';

import { PopupComponent } from './popup.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ PopupService ],
  declarations: [ PopupComponent ],
  exports: [ PopupComponent ],
  entryComponents: [ PopupComponent ]
})
export class PopupModule { }
