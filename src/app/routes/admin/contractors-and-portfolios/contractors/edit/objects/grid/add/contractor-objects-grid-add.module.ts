import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorObjectsGridAddComponent } from './contractor-objects-grid-add.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorObjectsGridAddComponent,
  ],
  declarations: [
    ContractorObjectsGridAddComponent,
  ],
})
export class ContractorObjectsGridAddModule { }
