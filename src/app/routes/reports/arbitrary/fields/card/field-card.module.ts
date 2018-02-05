import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { FieldCardComponent } from './field-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    FieldCardComponent,
  ],
  exports: [
    FieldCardComponent,
  ]
})
export class FieldCardModule { }
