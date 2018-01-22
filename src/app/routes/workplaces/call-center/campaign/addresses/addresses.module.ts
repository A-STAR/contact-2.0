import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { AddressesComponent } from './addresses.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    AddressesComponent,
  ],
  declarations: [
    AddressesComponent,
  ],
})
export class AddressesModule { }
