import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../form/dynamic-form/dynamic-form.module';

import { GridFilterComponent } from './filter.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    GridFilterComponent,
  ],
  declarations: [
    GridFilterComponent,
  ],
})
export class GridFilterModule { }
