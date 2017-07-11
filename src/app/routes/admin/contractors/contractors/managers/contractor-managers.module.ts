import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ContractorManagerEditModule } from './edit/contractor-manager-edit.module';

import { ContractorManagersComponent } from './contractor-managers.component';

@NgModule({
  imports: [
    ContractorManagerEditModule,
    SharedModule,
  ],
  exports: [
    ContractorManagerEditModule,
    ContractorManagersComponent,
  ],
  declarations: [
    ContractorManagersComponent,
  ]
})
export class ContractorManagersModule {
}
