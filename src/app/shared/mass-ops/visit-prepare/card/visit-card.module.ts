import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { VisitOperatorGridModule } from '../grid/visit-operator-grid.module';

import { VisitCardComponent } from './visit-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
    VisitOperatorGridModule,
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
