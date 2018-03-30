import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldGridModule } from './grid/field-grid.module';

import { FieldsService } from './fields.service';

@NgModule({
  imports: [
    CommonModule,
    FieldGridModule,
  ],
  exports: [
    FieldGridModule,
  ],
  providers: [
    FieldsService,
  ]
})
export class FieldsModule { }
