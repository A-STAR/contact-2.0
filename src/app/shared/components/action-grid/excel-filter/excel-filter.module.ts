import { NgModule } from '@angular/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';

import { ExcelFilterComponent } from './excel-filter.component';

@NgModule({
  declarations: [
    ExcelFilterComponent,
  ],
  exports: [
    ExcelFilterComponent,
  ],
  imports: [
    ButtonModule,
    DialogModule,
  ],
})
export class ExcelFilterModule {}
