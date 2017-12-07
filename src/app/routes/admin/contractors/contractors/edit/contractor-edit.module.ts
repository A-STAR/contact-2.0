import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { ContractorAttributesModule } from './attributes/contractor-attributes.module';

import { ContractorEditComponent } from './contractor-edit.component';

@NgModule({
  imports: [
    SharedModule,
    ContractorAttributesModule,
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
