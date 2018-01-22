import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { AddressComponent } from './address.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    AddressComponent,
  ],
  declarations: [
    AddressComponent,
  ],
})
export class AddressModule { }
