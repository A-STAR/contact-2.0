import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorGridComponent } from './contractor-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContractorGridComponent
  ],
  declarations: [
    ContractorGridComponent,
  ]
})
export class ContractorGridModule {}
