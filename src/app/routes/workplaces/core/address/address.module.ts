import { NgModule } from '@angular/core';

import { AddressService } from './address.service';

@NgModule({
  providers: [
    AddressService,
  ]
})
export class AddressModule {}
