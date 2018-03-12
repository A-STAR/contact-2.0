import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { CalculateDialogComponent } from './calculate-dialog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    CalculateDialogComponent
  ],
  declarations: [
    CalculateDialogComponent
  ],
})
export class FormulaCalculateModule { }
