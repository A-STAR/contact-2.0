import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ContractorManagersComponent } from './contractor-managers.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorManagersComponent
  ],
  declarations: [
    ContractorManagersComponent,
  ]
})
export class ContractorManagersModule {
}
