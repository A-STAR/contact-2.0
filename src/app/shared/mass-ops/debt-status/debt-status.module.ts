import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { TranslateModule } from '@ngx-translate/core';

import { DebtStatusService } from './debt-status.service';

import { DebtStatusComponent } from './dialog/debt-status.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule
  ],
  providers: [DebtStatusService],
  declarations: [DebtStatusComponent],
  exports: [DebtStatusComponent]
})
export class DebtStatusModule { }
