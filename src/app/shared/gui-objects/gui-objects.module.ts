import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { ContainerModule } from './container/container.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    ContainerModule,
  ],
  exports: [
    AddressModule,
    ContainerModule,
  ]
})
export class GuiObjectsModule { }
