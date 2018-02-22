import { NgModule } from '@angular/core';

import { ContractorObjectsGridModule } from './grid/contractor-objects-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorObjectsService } from '@app/routes/admin/contractors/contractor/edit/objects/contractor-objects.service';

import { ContractorObjectsComponent } from './contractor-objects.component';

@NgModule({
  imports: [
    ContractorObjectsGridModule,
    SharedModule,
  ],
  providers: [ ContractorObjectsService ],
  declarations: [
    ContractorObjectsComponent
  ],
  exports: [
    ContractorObjectsComponent
  ]
})
export class ContractorObjectsModule { }
