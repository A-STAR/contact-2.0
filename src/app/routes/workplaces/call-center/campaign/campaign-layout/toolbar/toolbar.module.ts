import { NgModule } from '@angular/core';

import { ProcessedDebtsModule } from './processed-debts/processed-debts.module';
import { SharedModule } from '@app/shared/shared.module';
import { StatusDialogModule } from './status-dialog/status-dialog.module';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    ProcessedDebtsModule,
    SharedModule,
    StatusDialogModule,
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
  ],
})
export class ToolbarModule {}
