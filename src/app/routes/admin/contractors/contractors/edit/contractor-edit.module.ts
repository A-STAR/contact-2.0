import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ContractorEditComponent } from './contractor-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorEditComponent
  ],
  declarations: [
    ContractorEditComponent,
  ]
})
export class ContractorEditModule {
}
