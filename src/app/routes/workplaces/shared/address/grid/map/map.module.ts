import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { AddressGridMapComponent } from './map.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [AddressGridMapComponent],
  exports: [ AddressGridMapComponent ],
})
export class AddressGridMapModule { }
