import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { ExcelFilterService } from './excel-filter.service';

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
    CommonModule,
    DialogModule,
    SelectModule,
  ],
  providers: [
    ExcelFilterService,
  ],
})
export class ExcelFilterModule {}
