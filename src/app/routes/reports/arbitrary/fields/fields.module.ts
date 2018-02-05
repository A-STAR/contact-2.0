import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldGridModule } from './grid/field-grid.module';
import { FieldCardModule } from './card/field-card.module';

import { FieldsService } from './fields.service';

@NgModule({
  imports: [
    CommonModule,
    FieldGridModule,
    FieldCardModule,
  ],
  exports: [
    FieldGridModule,
    FieldCardModule,
  ],
  providers: [
    FieldsService,
  ]
})
export class FieldsModule { }
