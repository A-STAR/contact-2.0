import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../../../components/form/dynamic-form/dynamic-form.module';

import { FormComponent } from './form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    FormComponent,
  ],
  declarations: [
    FormComponent,
  ],
  entryComponents: [
    FormComponent,
  ]
})
export class FormModule { }
