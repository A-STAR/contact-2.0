import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    SharedModule,
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
