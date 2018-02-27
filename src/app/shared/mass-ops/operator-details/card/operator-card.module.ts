import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { OperatorCardComponent } from './operator-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule
  ],
  exports: [
    OperatorCardComponent,
  ],
  declarations: [
    OperatorCardComponent,
  ],
  entryComponents: [
    OperatorCardComponent,
  ]
})
export class OperatorCardModule { }
