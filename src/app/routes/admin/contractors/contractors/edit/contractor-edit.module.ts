import { NgModule } from '@angular/core';

import { ContractorAttributesModule } from './attributes/contractor-attributes.module';
import { ContractorObjectsModule } from './objects/contractor-objects.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorEditComponent } from './contractor-edit.component';

@NgModule({
  imports: [
    ContractorAttributesModule,
    ContractorObjectsModule,
    SharedModule,
  ],
  exports: [
    ContractorEditComponent
  ],
  declarations: [
    ContractorEditComponent,
  ],
})
export class ContractorEditModule {}
