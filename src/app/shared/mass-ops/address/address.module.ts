import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressService } from './address.service';

import { AddressDialogComponent } from './dialog/address-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AddressService
  ],
  declarations: [ AddressDialogComponent ],
  exports: [ AddressDialogComponent ]
})
export class AddressModule { }
