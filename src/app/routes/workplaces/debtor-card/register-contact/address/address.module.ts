import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { AddressGridComponent } from './address.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent
  ],
})
export class AddressGridModule {}
