import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CheckModule } from '@app/shared/components/form/check/check.module';

import { CheckboxCellRendererComponent } from './renderers/checkbox.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    CheckboxCellRendererComponent,
  ],
  declarations: [
    CheckboxCellRendererComponent,
  ],
  entryComponents: [
    CheckboxCellRendererComponent,
  ]
})
export class GridsModule {}
