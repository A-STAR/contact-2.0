import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressCardService } from './address-card.service';

import { AddressCardComponent } from './address-card.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    AddressCardComponent,
  ],
  declarations: [
    AddressCardComponent,
  ],
  providers: [
    AddressCardService,
  ],
  entryComponents: [
    AddressCardComponent,
  ]
})
export class AddressCardModule { }
