import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapFilterComponent } from './map-filter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ MapFilterComponent ],
  exports: [ MapFilterComponent ],
  entryComponents: [ MapFilterComponent ],
})
export class MapFilterModule { }
