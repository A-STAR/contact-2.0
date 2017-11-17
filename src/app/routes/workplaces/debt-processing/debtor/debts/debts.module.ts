import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtsComponent } from './debts.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtsComponent,
  ],
  declarations: [
    DebtsComponent,
  ],
})
export class DebtsModule { }
