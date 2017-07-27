import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesComponent } from './addresses.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    AddressesComponent,
  ],
  declarations: [
    AddressesComponent,
  ]
})
export class AddressesModule { }
