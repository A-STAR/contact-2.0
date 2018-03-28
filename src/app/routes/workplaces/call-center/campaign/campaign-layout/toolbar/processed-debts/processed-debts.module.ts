import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ProcessedDebtsComponent } from './processed-debts.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ProcessedDebtsComponent,
  ],
  declarations: [
    ProcessedDebtsComponent,
  ],
})
export class ProcessedDebtsModule {}
