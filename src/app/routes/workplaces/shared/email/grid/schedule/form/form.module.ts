import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { FormComponent } from './form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
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
