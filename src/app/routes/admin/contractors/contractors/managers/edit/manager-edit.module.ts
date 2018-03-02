import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorManagerEditComponent } from './manager-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorManagerEditComponent
  ],
  declarations: [
    ContractorManagerEditComponent,
  ]
})
export class ContractorManagerEditModule {
}
