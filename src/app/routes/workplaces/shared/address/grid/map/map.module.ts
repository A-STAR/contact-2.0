import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressGridMapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AddressGridMapComponent],
  exports: [ AddressGridMapComponent ],
})
export class AddressGridMapModule { }
