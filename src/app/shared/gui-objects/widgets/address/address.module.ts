import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressGridModule } from './grid/address-grid.module';

@NgModule({
  imports: [
    AddressGridModule,
    CommonModule,
  ],
  exports: [
    AddressGridModule,
  ]
})
export class AddressModule { }
