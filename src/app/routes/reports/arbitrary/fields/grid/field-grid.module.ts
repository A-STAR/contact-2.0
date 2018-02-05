import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { FieldGridComponent } from './field-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FieldGridComponent,
  ],
  declarations: [
    FieldGridComponent,
  ]
})
export class FieldGridModule { }
