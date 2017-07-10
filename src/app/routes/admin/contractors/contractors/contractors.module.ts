import { NgModule } from '@angular/core';

import { ContractorEditModule } from './edit/contractor-edit.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ContractorsComponent } from './contractors.component';

@NgModule({
  imports: [
    ContractorEditModule,
    SharedModule,
  ],
  exports: [
    ContractorEditModule,
    ContractorsComponent
  ],
  declarations: [
    ContractorsComponent,
  ]
})
export class ContractorsModule {
}
