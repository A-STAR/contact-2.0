import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
  ],
  exports: [
    AddressModule,
  ]
})
export class WidgetsModule { }
