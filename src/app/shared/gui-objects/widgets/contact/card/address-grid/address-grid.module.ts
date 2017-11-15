import { NgModule } from '@angular/core';

import { AddressGridModule as AddressGridWidgetModule } from '../../../address/grid/address-grid.module';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    AddressGridWidgetModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent,
  ],
  entryComponents: [
    AddressGridComponent,
  ]
})
export class AddressGridModule { }
