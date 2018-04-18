import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '@app/shared/components/button/button.module';

import { MapToolbarComponent } from './map-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  declarations: [ MapToolbarComponent ],
  exports: [ MapToolbarComponent ],
  entryComponents: [ MapToolbarComponent ]
})
export class MapToolbarModule { }
