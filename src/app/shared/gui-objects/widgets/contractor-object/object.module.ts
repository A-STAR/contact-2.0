import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectGridModule } from './grid/object-grid.module';

import { ObjectService } from './object.service';

@NgModule({
  imports: [
    ObjectGridModule,
    CommonModule,
  ],
  exports: [
    ObjectGridModule,
  ],
  providers: [
    ObjectService,
  ]
})
export class ContractorObjectModule { }
