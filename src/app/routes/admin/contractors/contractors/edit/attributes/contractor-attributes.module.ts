import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorAttributesComponent } from './contractor-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    RoutesSharedModule,
    SharedModule
  ],
  declarations: [
    ContractorAttributesComponent
  ],
  exports: [
    ContractorAttributesComponent
  ]
})
export class ContractorAttributesModule { }
