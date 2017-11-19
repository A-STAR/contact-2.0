import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { AddressComponent } from './address.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    AddressComponent,
  ],
  declarations: [
    AddressComponent,
  ],
})
export class AddressModule { }
