import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DebtComponent } from './debt.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtComponent,
  ],
  declarations: [
    DebtComponent,
  ],
})
export class DebtModule {}
