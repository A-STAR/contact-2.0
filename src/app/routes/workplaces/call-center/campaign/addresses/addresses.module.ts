import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { AddressesComponent } from './addresses.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    AddressesComponent,
  ],
  declarations: [
    AddressesComponent,
  ],
})
export class AddressesModule { }
