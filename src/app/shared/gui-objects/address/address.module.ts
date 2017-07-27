import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressGridModule } from './grid/address-grid.module';

import { AddressService } from './address.service';

@NgModule({
  imports: [
    CommonModule,
    AddressGridModule,
  ],
  exports: [
    AddressGridModule,
  ],
  providers: [
    AddressService,
  ]
})
export class AddressModule { }
