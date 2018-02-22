import { NgModule } from '@angular/core';

import { ContractorEditModule } from './edit/contractor-edit.module';
import { ContractorManagersModule } from './managers/managers.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorsComponent } from './contractors.component';

@NgModule({
  imports: [
    ContractorEditModule,
    ContractorManagersModule,
    SharedModule,
  ],
  exports: [
    ContractorEditModule,
    ContractorManagersModule,
    ContractorsComponent
  ],
  declarations: [
    ContractorsComponent,
  ]
})
export class ContractorsModule {
}
