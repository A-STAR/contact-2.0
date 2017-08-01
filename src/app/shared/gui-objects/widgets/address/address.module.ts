import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressCardModule } from './card/address-card.module';
import { AddressGridModule } from './grid/address-grid.module';

@NgModule({
  imports: [
    AddressCardModule,
    AddressGridModule,
    CommonModule,
  ],
  exports: [
    AddressCardModule,
    AddressGridModule,
  ]
})
export class AddressModule { }
