import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../form/dynamic-form/dynamic-form.module';

import { ActionGridFilterComponent } from './action-grid-filter.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    ActionGridFilterComponent,
  ],
  declarations: [
    ActionGridFilterComponent,
  ]
})
export class ActionGridFilterModule { }
