import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapFilterComponent } from './map-filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [ MapFilterComponent ],
  exports: [ MapFilterComponent ],
  entryComponents: [ MapFilterComponent ],
})
export class MapFilterModule { }
