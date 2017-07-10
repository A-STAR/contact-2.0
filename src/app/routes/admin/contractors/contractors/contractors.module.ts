import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ContractorsComponent } from './contractors.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorsComponent
  ],
  declarations: [
    ContractorsComponent,
  ]
})
export class ContractorsModule {
}
