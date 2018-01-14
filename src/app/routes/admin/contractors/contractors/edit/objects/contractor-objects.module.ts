import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../../shared/shared.module';

import { ContractorObjectsComponent } from './contractor-objects.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ContractorObjectsComponent
  ],
  exports: [
    ContractorObjectsComponent
  ]
})
export class ContractorObjectsModule { }
