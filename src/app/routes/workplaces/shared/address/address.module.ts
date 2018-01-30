import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressCardModule } from './card/address-card.module';
import { AddressGridModule } from './grid/address-grid.module';

import { AddressService } from './address.service';

@NgModule({
  imports: [
    AddressCardModule,
    AddressGridModule,
    CommonModule,
  ],
  exports: [
    AddressCardModule,
    AddressGridModule,
  ],
  providers: [
    AddressService,
  ]
})
export class AddressModule { }
