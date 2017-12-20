import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { VisitCardComponent } from './visit-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule
  ],
  exports: [
    VisitCardComponent,
  ],
  declarations: [
    VisitCardComponent,
  ],
  entryComponents: [
    VisitCardComponent,
  ]
})
export class VisitCardModule { }
