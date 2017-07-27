import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesModule } from './addresses/addresses.module';

@NgModule({
  imports: [
    CommonModule,
    AddressesModule,
  ],
  exports: [
    AddressesModule,
  ]
})
export class GuiObjectsModule { }
