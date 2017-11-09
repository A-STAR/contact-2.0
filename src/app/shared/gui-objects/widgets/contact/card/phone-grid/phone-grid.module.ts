import { NgModule } from '@angular/core';

import { PhoneGridModule as PhoneGridWidgetModule } from '../../../phone/grid/phone-grid.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    PhoneGridWidgetModule,
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent,
  ],
  entryComponents: [
    PhoneGridComponent,
  ]
})
export class PhoneGridModule { }
