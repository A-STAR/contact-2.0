import { NgModule } from '@angular/core';

import { ProcessedDebtsModule } from './processed-debts/processed-debts.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    ProcessedDebtsModule,
    SharedModule,
  ],
  exports: [
    ToolbarComponent,
  ],
  declarations: [
    ToolbarComponent,
  ],
})
export class ToolbarModule { }
