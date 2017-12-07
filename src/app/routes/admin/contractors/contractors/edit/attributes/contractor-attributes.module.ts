import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../../shared/shared.module';

import { ContractorAttributesComponent } from './contractor-attributes.component';

@NgModule({
  imports: [
    CommonModule,
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
