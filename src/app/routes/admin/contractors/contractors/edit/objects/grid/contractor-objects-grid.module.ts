import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractorObjectsGridAddModule } from './add/contractor-objects-grid-add.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorObjectsGridComponent } from './contractor-objects-grid.component';

@NgModule({
  imports: [
    ContractorObjectsGridAddModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule,
  ],
  exports: [
    ContractorObjectsGridComponent,
  ],
  declarations: [
    ContractorObjectsGridComponent,
  ],
  entryComponents: [
    ContractorObjectsGridComponent,
  ]
})
export class ContractorObjectsGridModule { }
