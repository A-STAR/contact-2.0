import { NgModule } from '@angular/core';

import { ContractorManagerEditModule } from './edit/manager-edit.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorManagersComponent } from './managers.component';

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
